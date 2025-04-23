import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true },
  week: { type: Number, required: true },
  discovery: { type: String },
  discussion: { type: String },
  abundance: { type: String },
  scarcity: { type: String },
  contempt: { type: Number, default: 0 },
  project_title: { type: String },
  project_desc: { type: String },
  project_weeks: { type: Number, min: 0, max: 6 },
  pp_title: { type: String },
  pp_desc: { type: String },
  pp_weeks: { type: Number, min: 0, max: 6 },
  p_discussion: { type: String },
  p_discovery: { type: String }
});

const Stats = mongoose.model('Stats', statSchema);
export default Stats;