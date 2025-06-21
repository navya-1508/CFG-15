import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["pre", "post"],
      required: true,
    },
    language: {
      type: String,
      enum: ["english", "hindi", "telugu"],
      required: true,
    },
    questionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MCQQuestion",
      },
    ],
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
