import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Function to create an admin user
async function createAdmin(username, password) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin with username '${username}' already exists.`);
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin user
    const admin = new Admin({
      username,
      password: hashedPassword,
    });

    // Save the admin to the database
    await admin.save();
    console.log(`Admin '${username}' created successfully.`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error creating admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script with default values if no arguments are provided
const username = process.argv[2] || "abhi";
const password = process.argv[3] || "Admin@123";

// Call the function to create the admin
createAdmin(username, password);
