import Game from '../models/gameSchema.js';

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const getLatestGame = async (req, res) => {
//   try {
//     const latest = await Game.findOne().sort({ week: -1 }).limit(1);
//     res.json(latest || { week: 0 });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Get the latest game for a user
export const getLatestGame = async (req, res) => {
  const { user_id, title } = req.query;
  try {
    const latestGame = await Game.findOne({ user_id, title }).sort({ week: -1 });
    if (!latestGame) return res.status(404).send('No games found for this user and title');
    res.json(latestGame);
  } catch (err) {
    res.status(500).send('Error fetching latest game');
  }
};

export const getGameByTitleAndWeek = async (req, res) => {
  const { title, week } = req.params;
  try {
    const game = await Game.findOne({ title, week });
    if (!game) return res.status(404).send('Game not found');
    res.json(game);
  } catch (err) {
    res.status(500).send('Error fetching game data');
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a game by title
export const getGameByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const game = await Game.findOne({ title });
    if (!game) return res.status(404).send('Game not found');
    res.json(game);
  } catch (err) {
    res.status(500).send('Error fetching game by title');
  }
};

export const createGameEntry = async (req, res) => {
  try {
    const { prompt_id, ...gameData } = req.body; // Exclude prompt_id
    const newGame = new Game(gameData);
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const savePromptData = async (req, res) => {
  const { title, week } = req.params;
  const promptData = req.body;

  try {
    const game = await Game.findOne({ title, week }); // Find the specific week's entry
    if (!game) return res.status(404).send('Game not found');

    game.prompts.push(promptData); // Add the prompt data to the week's prompts
    await game.save();

    res.status(201).send('Prompt data saved successfully');
  } catch (err) {
    res.status(500).send('Error saving prompt data');
  }
};

// Update a game by week
export const updateGameByWeek = async (req, res) => {
  const { title, week } = req.params;
  const updates = req.body;

  try {
    const game = await Game.findOneAndUpdate({ title, week }, updates, { new: true });
    if (!game) return res.status(404).send('Game not found');
    res.json(game);
  } catch (err) {
    res.status(500).send('Error updating game by week');
  }
};

export const updateGameByTitle = async (req, res) => {
  const { title } = req.params;
  const updates = req.body;

  try {
    const game = await Game.findOneAndUpdate({ title }, updates, { new: true });
    if (!game) return res.status(404).send('Game not found');
    res.json(game);
  } catch (err) {
    res.status(500).send('Error updating game by title');
  }
};

export const updateGameEntry = async (req, res) => {
  try {
    const updated = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Game not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a game by title
export const deleteGameByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const game = await Game.findOneAndDelete({ title });
    if (!game) return res.status(404).send('Game not found');
    res.send('Game deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting game by title');
  }
};

export const deleteGameEntry = async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
