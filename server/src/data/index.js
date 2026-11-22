const path = require('path');

// Single source of truth shared with the client's offline bundle.
const sharedDataDir = path.resolve(__dirname, '../../../shared/data');

const helplines = require(path.join(sharedDataDir, 'helplines.json'));
const articles = require(path.join(sharedDataDir, 'articles.json'));

module.exports = { helplines, articles };
