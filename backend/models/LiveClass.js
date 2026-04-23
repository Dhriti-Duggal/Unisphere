const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Either courseId or groupId
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Future group support
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scheduledTime: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "live", "ended"], default: "scheduled" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LiveClass", liveClassSchema);
