// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//   game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
//   stats_week: { type: mongoose.Schema.Types.ObjectId, ref: 'Stats', required: true}, //not sure about this one, need it to connect to Week in Stats
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   weeks: { type: Number, min: 0, max: 6, required: true },
//   result: { type: String }
// });

// const Project = mongoose.model('Project', projectSchema);
// export default Project;