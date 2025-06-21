import mongoose from "mongoose";

const languageStaffSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    languageStaff: [languageStaffSchema], // Array of language blocks
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
