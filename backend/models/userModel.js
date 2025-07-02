import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  phone: { type: String },
  // Add more fields as needed
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;