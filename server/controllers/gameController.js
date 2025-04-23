import Game from '../models/gameSchema.js';

export const getAllGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};

export const createGame = async (req, res) => {
  const newGame = new Game(req.body);
  await newGame.save();
  res.json(newGame);
};

export const getGameById = async (req, res) => {
  const game = await Game.findById(req.params.id);
  res.json(game);
};

export const updateGame = async (req, res) => {
  const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedGame);
};

export const deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ message: 'Game deleted' });
};