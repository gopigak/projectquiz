const mongoose = require('mongoose');

let isConnected = false;

const seedIfEmpty = async () => {
  try {
    const Course = require('../models/Course');
    const User = require('../models/User');
    const courses = require('../data/coursesData');
    
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('No courses found in MongoDB. Auto-seeding courses...');
      await Course.insertMany(courses);
      console.log(`Successfully auto-seeded ${courses.length} courses!`);
    }

    const adminEmail = 'admin@quizapp.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log('No admin user found in MongoDB. Auto-seeding default admin...');
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin',
        xpPoints: 1500,
        badges: ['Platform Architect', 'Welcome Cadet'],
        streakCount: 1,
        lastActiveDate: new Date()
      });
      console.log('Successfully auto-seeded default admin user!');
    }
  } catch (error) {
    console.error('⚠️ Error during database auto-seeding:', error.message);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    
    // Set low timeout (2.5 seconds) to fallback quickly if offline
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    
    // Auto-seed database if empty
    await seedIfEmpty();
  } catch (error) {
    console.warn(`\n⚠️  MongoDB Connection Failed: ${error.message}`);
    console.warn('⚙️  Switching server to In-Memory Mock Database Mode (fully functional sandbox for testing).\n');
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
