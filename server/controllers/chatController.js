import Message from "../models/Message.js";

// Send a message (personal or group)
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, groupId, content } = req.body;

    const message = new Message({
      sender,
      receiver: receiver || null,
      groupId: groupId || null,
      content
    });

    const saved = await message.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages (personal or group)
export const getMessages = async (req, res) => {
  try {
    const { user1, user2, groupId } = req.query;

    let messages = [];

    if (groupId) {
      messages = await Message.find({ groupId }).sort({ timestamp: 1 });
    } else if (user1 && user2) {
      messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ timestamp: 1 });
    } else {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};
