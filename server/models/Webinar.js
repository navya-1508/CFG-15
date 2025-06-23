// models/Webinar.js
import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  channelName: { type: String, required: true, unique: true },
  token: { type: String },
}, { timestamps: true });

const Webinar = mongoose.model('Webinar', webinarSchema);
export default Webinar;
