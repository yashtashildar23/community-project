const mongoose = require('mongoose');

/**
 * Connects to MongoDB when MONGODB_URI is configured.
 * The app is offline-first, so a missing or unreachable database is NOT fatal:
 * controllers automatically fall back to the bundled JSON dataset.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[db] MONGODB_URI not set — using bundled offline dataset.');
    return null;
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[db] Connected to MongoDB (${connection.connection.name})`);
    return connection;
  } catch (error) {
    console.warn(`[db] MongoDB unavailable — using bundled dataset. (${error.message})`);
    return null;
  }
}

function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDB, isConnected };
