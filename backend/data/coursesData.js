const { getGeneratedCourses } = require('./curriculumData');

// Return generated courses list containing 15 courses with 15-20 chapters each, and 25 questions per chapter
const courses = getGeneratedCourses();

module.exports = courses;
