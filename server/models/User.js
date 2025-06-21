import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
        enum: ['user', 'champion', 'saathi'],
        default: 'user',
    
    },
    language :{
        type: String,
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.png', // Replace with your default image URL
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;

