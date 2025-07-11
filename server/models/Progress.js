import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedOn: {
      type: Date,
    },
    videoDetails: {
      videoId: {
        type: String,
      },
      watched: {
        type: Boolean,
        default: false,
      },
      watchDuration: {
        type: Number, // in seconds
        default: 0,
      },
      watchedOn: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
