const Helpline = require('../models/Helpline');
const { isConnected } = require('../config/db');
const { helplines } = require('../data');

/** Shared filter used by both the database and offline paths. */
function filterHelplines(items, { region, category, language, search } = {}) {
  let results = items;

  if (region) {
    results = results.filter((item) => item.region === region);
  }
  if (category) {
    results = results.filter((item) =>
      item.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }
  if (language) {
    results = results.filter((item) =>
      item.languages.some((l) => l.toLowerCase() === language.toLowerCase())
    );
  }
  if (search) {
    const term = search.toLowerCase();
    results = results.filter((item) =>
      [item.name, item.description, item.number, ...item.categories, ...item.languages]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }

  // Featured first, then alphabetical.
  return [...results].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
  );
}

/** Try MongoDB, then fall back to the bundled offline dataset. */
async function getHelplineCollection() {
  if (!isConnected()) return helplines;
  try {
    const docs = await Helpline.find().lean();
    return docs.length ? docs : helplines;
  } catch (error) {
    console.warn('[helplines] DB read failed, using offline data:', error.message);
    return helplines;
  }
}

async function getHelplines(req, res) {
  try {
    const collection = await getHelplineCollection();
    const results = filterHelplines(collection, req.query);
    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load helplines.' });
  }
}

async function getHelplineById(req, res) {
  try {
    const collection = await getHelplineCollection();
    const helpline = collection.find((item) => item.id === req.params.id);

    if (!helpline) {
      return res.status(404).json({ success: false, error: 'Helpline not found.' });
    }
    return res.status(200).json({ success: true, data: helpline });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load helpline.' });
  }
}

module.exports = { getHelplines, getHelplineById, filterHelplines };
