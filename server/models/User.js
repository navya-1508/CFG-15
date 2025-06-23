import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "champion", "saathi"],
      default: "user",
    },
    language: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "https://example.com/default-profile-picture.png", // Replace with your default image URL
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    badges: [
      {
        sessionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
        },
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        name: String,
        earnedOn: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preTestScore: {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      score: Number,
      takenOn: Date,
    },
    postTestScore: {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      score: Number,
      takenOn: Date,
    },
    certificates: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        certificateId: String,
        issueDate: Date,
      },
    ],
    promotionRequest: {
      requestedAt: Date,
      currentRole: String,
      requestedRole: String,
      reason: String,
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
      },
      processedAt: Date,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      feedback: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
