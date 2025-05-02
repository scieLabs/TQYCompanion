import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    end: { type: String },
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;
