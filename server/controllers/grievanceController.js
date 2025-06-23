import Grievance from "../models/Grievance.js";

// Submit grievance
export const submitGrievance = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const grievance = new Grievance({
      user: req.userId,
      subject,
      message,
    });

    const saved = await grievance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error submitting grievance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all grievances (admin only)
export const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("user", "username email role")
      .sort({ createdAt: -1 });

    res.status(200).json(grievances);
  } catch (err) {
    console.error("Error fetching grievances:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get grievances by logged-in user
export const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(grievances);
  } catch (err) {
    console.error("Error fetching user's grievances:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update grievance status or response (admin only)
export const updateGrievance = async (req, res) => {
  try {
    const { status, response } = req.body;

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status, response },
      { new: true }
    );

    if (!grievance) return res.status(404).json({ message: "Grievance not found" });

    res.status(200).json(grievance);
  } catch (err) {
    console.error("Error updating grievance:", err);
    res.status(500).json({ message: "Server error" });
  }
};
