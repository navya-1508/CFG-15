// controllers/webinarController.js
import Webinar from '../models/Webinar.js';
import { generateAgoraToken } from '../utils/generateAgoraToken.js';

export const createWebinar = async (req, res) => {
  try {
    const { title, description, scheduledAt, duration } = req.body;
    const host = req.user._id;

  
    const channelName = `webinar-${Date.now()}`;

 
    const token = generateAgoraToken(channelName);

    const webinar = new Webinar({
      title,
      description,
      scheduledAt,
      duration,
      host,
      channelName,
      token,
    });

    const savedWebinar = await webinar.save();
    res.status(201).json(savedWebinar);
  } catch (error) {
    console.error("Error creating webinar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllWebinars = async (req, res) => {
  try {
    const webinars = await Webinar.find().populate('host', 'username email');
    res.status(200).json(webinars);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch webinars" });
  }
};
