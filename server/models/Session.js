import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
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
    order: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    resourcesByLanguage: [
      {
        language: {
          type: String,
          required: true,
        },
        resources: [
          {
            type: {
              type: String, // 'video', 'pdf', 'link'
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
            fileName: {
              type: String, // Original filename for uploaded files
            },
            fileSize: {
              type: Number, // Size in bytes
            },
            mimeType: {
              type: String, // MIME type of the file
            },
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
            uploadedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Teacher", // Trainer
              required: true,
            },
            approved: {
              type: Boolean,
              default: false,
            },
            approvedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Teacher", // Mentor
            },
            approvedAt: Date,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
