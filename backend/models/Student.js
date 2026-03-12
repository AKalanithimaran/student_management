const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Pending', 'Blocked'],
      default: 'Active'
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    enrollmentDate: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
