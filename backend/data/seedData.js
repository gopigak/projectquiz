const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const QuizResult = require('../models/QuizResult');
const courses = require('./coursesData'); // Import shared courses data

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing old Courses and QuizResults...');
    await Course.deleteMany({});
    await QuizResult.deleteMany({});

    console.log(`Seeding ${courses.length} courses...`);
    const createdCourses = await Course.insertMany(courses);
    console.log(`Successfully seeded ${createdCourses.length} courses!`);

    // Ensure Admin account exists
    const adminEmail = 'admin@quizapp.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log('Seeding default administrator user: admin@quizapp.com / adminpassword123...');
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
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedDB();
