const mongoose = require('mongoose');

const ValidStudentIDSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('ValidStudentID', ValidStudentIDSchema);