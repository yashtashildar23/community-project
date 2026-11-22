// Bundled offline dataset — the single source of truth shared with the server.
import helplines from '../../../shared/data/helplines.json';
import articles from '../../../shared/data/articles.json';
import screeners from '../../../shared/data/screeners.json';

export { helplines, articles, screeners };
export const screenerList = screeners.screeners;
export const screenerOptions = screeners.options;
