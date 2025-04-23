import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: { type: Number, default: 0 }, //this should take from the Stats week field, or maybe we could just write to both at the same time? idk
  end: { type: String }
});

const Game = mongoose.model('Game', gameSchema);
export default Game;