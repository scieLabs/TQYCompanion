import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, required: true },
    currentSeason: { type: String, default: 'Spring' },
    updatedAt: { type: Date, default: Date.now },
    shownPrompts: { type: [mongoose.Schema.Types.ObjectId], default: [] }, // Array of shown prompt IDs
    end: { type: String },
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
