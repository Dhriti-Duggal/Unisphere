const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    points: { type: Number, default: 100 },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileUrl: { type: String },
        grade: { type: Number },
        status: { type: String, enum: ["submitted", "graded", "late"], default: "submitted" },
        submittedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
