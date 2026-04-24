const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    departmentId: { type: String },
    category: { type: String, default: "General" },
    description: { type: String },
    semester: { type: String },
    group: { type: String, default: "" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    progress: { type: Number, default: 0 },
    color: { type: String, default: "from-blue-600 to-cyan-600" } // random or chosen color
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
