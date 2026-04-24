const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },

  // Onboarding fields
  departmentId: {
    type: String,
    default: ''
  },

  department: {
    type: String,
    default: ''
  },

  studentId: {
    type: String,
    default: ''
  },

  year: {
    type: String,
    default: ''
  },

  group: {
    type: String,
    default: ''
  },

  teachingGroups: {
    type: [String],
    default: []
  },

  bio: {
    type: String,
    default: ''
  },

  phone: {
    type: String,
    default: ''
  },

  location: {
    type: String,
    default: ''
  },

  avatarUrl: {
    type: String,
    default: ''
  },

  onboardingComplete: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)