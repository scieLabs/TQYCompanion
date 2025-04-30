import Game from '../models/gameSchema.js';

export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the latest game for a user
export const getLatestGame = async (req, res) => {
  const { user_id, title } = req.query;
  try {
    const latestGame = await Game.findOne({ user_id, title }).sort({ week: -1 });
    if (!latestGame) return res.status(404).json({message: 'No games found for this user and title'});
    res.json(latestGame);
  } catch (err) {
    res.status(500).json({message: 'Error fetching latest game'});
  }
};

export const getGameByTitleAndWeek = async (req, res) => {
  const { title, week } = req.params;

  // Validate required parameters
  if (!title || !week) {
    return res.status(400).json({ message: 'Both title and week parameters are required.' });
  }

  try {
    const game = await Game.findOne({ title, week });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching game data' });
  }
};

//FIXME: Old version

// export const getGameByTitleAndWeek = async (req, res) => {
//   const { title, week } = req.params;
//   try {
//     const game = await Game.findOne({ title, week });
//     if (!game) return res.status(404).json({message: 'Game not found'});
//     res.json(game);
//   } catch (err) {
//     res.status(500).json({message: 'Error fetching game data'});
//   }
// };

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
    if (!game) return res.status(404).json({message: 'Game not found'});
    res.json(game);
  } catch (err) {
    res.status(500).json({message: 'Error fetching game by title'});
  }
};


export const createGameEntry = async (req, res) => {
  try {
    const { title, description, abundance, scarcity, user_id } = req.body;

    // Validate required fields
    if (!title || !description || !abundance || !scarcity || !user_id) {
      return res.status(400).json({ message: 'All fields (title, description, abundance, scarcity, user_id) are required.' });
    }

    // Create a new game entry
    const newGame = new Game({
      title,
      description,
      abundance,
      scarcity,
      user_id,
    });

    await newGame.save();
    res.status(201).json({ message: 'Game created successfully.', game: newGame });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//FIXME: Old version
// export const createGameEntry = async (req, res) => {
//   try {
//     const { prompt_id, ...gameData } = req.body; // Exclude prompt_id
//     const newGame = new Game(gameData);
//     await newGame.save();
//     res.status(201).json(newGame);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

export const saveActionData = async (req, res) => {
  const { title, week } = req.params; // Extract title and week from the route parameters
    if (!week)
      return res.status(400).json({ error: 'Week parameter is required' }); // Validate week
  const actionData = req.body; // Extract the data to be saved

  try {
    // Find the specific game entry by title and week
    const game = await Game.findOne({ title, week });
    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Update the relevant fields in the game document
    // prompt specific
    if (actionData.p_discussion) game.p_discussion = actionData.p_discussion;
    if (actionData.p_discovery) game.p_discovery = actionData.p_discovery;
    if (actionData.pp_title) game.pp_title = actionData.pp_title;
    if (actionData.pp_desc) game.pp_desc = actionData.pp_desc;
    if (actionData.pp_weeks) game.pp_weeks = actionData.pp_weeks;

    // General game action fields
    if (actionData.discussion) game.discussion = actionData.discussion;
    if (actionData.discovery) game.discovery = actionData.discovery;
    if (actionData.project_title) game.project_title = actionData.project_title;
    if (actionData.project_desc) game.project_desc = actionData.project_desc;
    if (actionData.project_weeks) game.project_weeks = actionData.project_weeks;
    

    // Save the updated game document
    await game.save();

    res.status(200).json({ message: 'Prompt data saved successfully', game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a game by week

export const updateGameByWeek = async (req, res) => {
  const { title } = req.params;
  let { week } = req.params; // Extract week as a string
  const updates = req.body;

  // Validate required parameters
  if (!title || !week) {
    return res.status(400).json({ message: 'Both title and week parameters are required.' });
  }

  // Parse week to a number
  week = Number(week);
  if (isNaN(week)) {
    return res.status(400).json({ message: 'Invalid week parameter. It must be a number.' });
  }

  try {
    const game = await Game.findOneAndUpdate({ title, week }, updates, { new: true });
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: 'Error updating game by week' });
  }
};

//FIXME: Old version
// export const updateGameByWeek = async (req, res) => {
//   const { title } = req.params;
//   let { week } = req.params; // Extract week as a string
//   const updates = req.body;

//   // Parse week to a number
//   week = Number(week);
//   if (isNaN(week)) {
//     return res.status(400).json({ error: 'Invalid week parameter. It must be a number.' });
//   }

//   try {
//     const game = await Game.findOneAndUpdate({ title, week }, updates, { new: true });
//     if (!game) return res.status(404).json({ message: 'Game not found' });
//     res.json(game);
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating game by week' });
//   }
// };

export const updateGameByTitle = async (req, res) => {
  const { title } = req.params;
  const updates = req.body;

  try {
    const game = await Game.findOneAndUpdate({ title }, updates, { new: true });
    if (!game) return res.status(404).json({message: 'Game not found'});
    res.json(game);
  } catch (err) {
    res.status(500).json({message: 'Error updating game by title'});
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
    if (!game) return res.status(404).json({message: 'Game not found'});
    res.json({message: 'Game deleted successfully'});
  } catch (err) {
    res.status(500).json({message: 'Error deleting game by title'});
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
