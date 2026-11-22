require('dotenv').config();
const mongoose = require('mongoose');
const Helpline = require('../models/Helpline');
const Article = require('../models/Article');
const { helplines, articles } = require('../data');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Set MONGODB_URI in server/.env before seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    await Helpline.bulkWrite(
      helplines.map((item) => ({
        updateOne: { filter: { id: item.id }, update: { $set: item }, upsert: true },
      }))
    );
    await Article.bulkWrite(
      articles.map((item) => ({
        updateOne: { filter: { id: item.id }, update: { $set: item }, upsert: true },
      }))
    );
    console.log(`Seeded ${helplines.length} helplines and ${articles.length} articles.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
