import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  season: { type: String, required: true },
  prompt_title: { type: String, required: true },
  prompt: { type: String, required: true },
  isSpecial: { type: Boolean },
  isProject: { type: Boolean }
});

const Prompt = mongoose.model('Prompt', promptSchema);
export default Prompt;