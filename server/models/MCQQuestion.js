import mongoose from "mongoose";

const mcqQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

const MCQQuestion = mongoose.model("MCQQuestion", mcqQuestionSchema);
export default MCQQuestion;
