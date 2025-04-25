import Prompt from '../models/promptSchema.js';
import Game from '../models/gameSchema.js';

export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find();
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPrompt = async (req, res) => {
  try {
    const newPrompt = new Prompt(req.body);
    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePrompt = async (req, res) => {
  try {
    const updated = await Prompt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Prompt not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePrompt = async (req, res) => {
  try {
    const deleted = await Prompt.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Prompt not found' });
    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNextPrompt = async (req, res) => {
  try {
    const week = parseInt(req.query.week);
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const season = seasons[Math.min(Math.floor((week - 1) / 13), 3)];

    // Fetch all used prompt IDs from the Game model
    const usedPromptIds = (await Game.find()).map(game => game.prompt_id.toString());

    // Find the next available prompt for the current season
    const prompt = await Prompt.findOne({ season, _id: { $nin: usedPromptIds } });

    if (!prompt) return res.status(404).json({ message: 'No more prompts in this season' });
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPromptsBySeason = async (req, res) => {
  try {
    const { season } = req.params; // Extract the season from the route parameters
    const validSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

    // Validate the season parameter
    if (!validSeasons.includes(season)) {
      return res.status(400).json({ message: 'Invalid season. Valid seasons are Spring, Summer, Autumn, and Winter.' });
    }

    // Fetch prompts for the specified season
    const prompts = await Prompt.find({ season });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
