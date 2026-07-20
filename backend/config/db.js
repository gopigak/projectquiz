const mongoose = require('mongoose');
const dns = require('dns');

// Fallback DNS servers to prevent querySrv ECONNREFUSED on local Windows / serverless environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  // Ignore if setting DNS is restricted
}

let isConnected = false;
let dbPromise = null;

const seedIfEmpty = async () => {
  try {
    const Course = require('../models/Course');
    const User = require('../models/User');
    const courses = require('../data/coursesData');
    
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('[DB Seed] No courses found in MongoDB Atlas. Auto-seeding courses...');
      await Course.insertMany(courses);
      console.log(`[DB Seed] Successfully auto-seeded ${courses.length} courses!`);
    }

    const adminEmail = 'admin@quizapp.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      console.log('[DB Seed] No admin user found in MongoDB. Auto-seeding default admin...');
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
      console.log('[DB Seed] Successfully auto-seeded default admin user!');
    }

    const studentEmail = 'student@quizapp.com';
    const studentExists = await User.findOne({ email: studentEmail });
    if (!studentExists) {
      console.log('[DB Seed] Auto-seeding default student user...');
      await User.create({
        name: 'Test Student',
        email: studentEmail,
        password: 'studentpassword123',
        role: 'user',
        xpPoints: 150,
        badges: ['Welcome Cadet'],
        streakCount: 1,
        lastActiveDate: new Date()
      });
      console.log('[DB Seed] Successfully auto-seeded default student user!');
    }
  } catch (error) {
    console.error('⚠️ [DB Seed] Error during database auto-seeding:', error.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = (async () => {
    try {
      const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
      
      if (!rawUri) {
        console.warn('⚠️  [DB] No MONGODB_URI environment variable set. Falling back to Mock Database Mode.');
        isConnected = false;
        dbPromise = null;
        return;
      }

      // Mask password for safe logging
      const maskedUri = rawUri.replace(/\/\/(.*):(.*)@/, '//$1:****@');
      console.log(`[DB] Connecting to MongoDB at: ${maskedUri}...`);
      
      // Allow up to 10s for DNS resolution and serverless cold-start TLS handshakes
      const conn = await mongoose.connect(rawUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      });
      
      console.log(`✅ [DB] MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
      isConnected = true;
      dbPromise = null;
      
      // Auto-seed database if empty
      await seedIfEmpty();
      return conn.connection;
    } catch (error) {
      console.error(`\n⚠️  [DB] MongoDB Connection Failed: ${error.message}`);
      console.warn('⚙️  [DB] Switching server to In-Memory Mock Database Mode.\n');
      isConnected = false;
      dbPromise = null;
    }
  })();

  return dbPromise;
};

const getIsConnected = () => {
  return mongoose.connection.readyState === 1 || isConnected;
};

module.exports = { connectDB, getIsConnected };

