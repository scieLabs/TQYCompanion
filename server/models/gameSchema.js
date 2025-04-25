import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
//   prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: true }, //make array
  prompts: [
  {
    prompt_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Prompt',
    },
  },
],
  title: { type: String, required: true },
  description: { type: String, required: true },
  week: { type: Number, default: 0, required: true },
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
  p_discovery: { type: String },
  end: { type: String }
}, { timestamps: true });

gameSchema.index({ title: 1, week: 1 }, { unique: true }); // Ensure unique combination of title and week

const Game = mongoose.model('Game', gameSchema);
export default Game;
