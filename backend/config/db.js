const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    // Set low timeout (2.5 seconds) to fallback quickly if offline
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.warn(`\n⚠️  MongoDB Connection Failed: ${error.message}`);
    console.warn('⚙️  Switching server to In-Memory Mock Database Mode (fully functional sandbox for testing).\n');
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
