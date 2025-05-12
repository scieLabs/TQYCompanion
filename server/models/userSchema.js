import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  activeGames: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }], // Array of active game IDs
});

const User = mongoose.model('User', userSchema);
export default User;