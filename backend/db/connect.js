const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  if (!config.db.uri) {
    throw new Error('MONGODB_URI is not set. Please configure it in server/.env');
  }

  await mongoose.connect(config.db.uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log('[db] MongoDB connected ✅');
};

module.exports = connectDB;
