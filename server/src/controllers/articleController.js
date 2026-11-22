const Article = require('../models/Article');
const { isConnected } = require('../config/db');
const { articles } = require('../data');

async function getArticleCollection() {
  if (!isConnected()) return articles;
  try {
    const docs = await Article.find().lean();
    return docs.length ? docs : articles;
  } catch (error) {
    console.warn('[articles] DB read failed, using offline data:', error.message);
    return articles;
  }
}

async function getArticles(req, res) {
  try {
    const collection = await getArticleCollection();
    let results = collection;

    if (req.query.category) {
      results = results.filter(
        (item) => item.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load articles.' });
  }
}

async function getArticleById(req, res) {
  try {
    const collection = await getArticleCollection();
    const article = collection.find((item) => item.id === req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found.' });
    }
    return res.status(200).json({ success: true, data: article });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to load article.' });
  }
}

module.exports = { getArticles, getArticleById };
