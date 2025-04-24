import Prompt from '../models/promptSchema.js';

export const getAllPrompts = async (req, res) => {
  const prompts = await Prompt.find();
  res.json(prompts);
};

export const createPrompt = async (req, res) => {
  const newPrompt = new Prompt(req.body);
  await newPrompt.save();
  res.json(newPrompt);
};

export const getPromptById = async (req, res) => {
  const prompt = await Prompt.findById(req.params.id);
  res.json(prompt);
};

export const updatePrompt = async (req, res) => {
  const updatedPrompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPrompt);
};

export const deletePrompt = async (req, res) => {
  await Prompt.findByIdAndDelete(req.params.id);
  res.json({ message: 'Prompt deleted' });
};