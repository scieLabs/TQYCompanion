import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    stats_week: { type: Number, required: true },
    project_title: { type: String },
    project_desc: { type: String },
    project_weeks: { type: Number, min: 0, max: 6 },
    project_resolve: { type: String },
    pp_title: { type: String },
    pp_desc: { type: String },
    pp_weeks: { type: Number, min: 0, max: 6 },
    pp_resolve: { type: String },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;