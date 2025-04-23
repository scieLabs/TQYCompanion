import Stats from '../models/statSchema.js';

export const getAllStats = async (req, res) => {
  const stats = await Stats.find();
  res.json(stats);
};

export const createStats = async (req, res) => {
  const newStats = new Stats(req.body);
  await newStats.save();
  res.json(newStats);
};

export const getStatsById = async (req, res) => {
  const stats = await Stats.findById(req.params.id);
  res.json(stats);
};

export const updateStats = async (req, res) => {
  const updatedStats = await Stats.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedStats);
};

export const deleteStats = async (req, res) => {
  await Stats.findByIdAndDelete(req.params.id);
  res.json({ message: 'Stats entry deleted' });
};