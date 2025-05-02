import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' },
    week: { type: Number, default: 1, required: true },
    discovery: { type: String },
    discussion: { type: String },
    abundance: { type: String },
    scarcity: { type: String },
    contempt: { type: Number, default: 0 },
    p_discussion: { type: String },
    p_discovery: { type: String },
  },
  { timestamps: true }
);

statsSchema.index({ game_id: 1, week: 1 }, { unique: true }); // Ensure unique combination of game_id and week

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;