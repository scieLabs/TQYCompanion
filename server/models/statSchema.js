import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
  week: { type: Number, required: true },
  discovery: { type: String },
  discussion: { type: String },
  abundance: { type: String },
  scarcity: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  contempt: { type: Number, default: 0 }
});

const Stats = mongoose.model('Stats', statSchema);
export default Stats;