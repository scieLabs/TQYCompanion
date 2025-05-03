import Game from '../models/gameSchema.js';
import User from '../models/userSchema.js';
import Stats from '../models/statsSchema.js';
import mongoose from 'mongoose';

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
  const { user_id } = req.query; //TODO: removed title here and below

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const latestGame = await Game.findOne({ user_id }).sort({ createdAt: -1 });
    if (!latestGame) return res.status(404).json({message: 'No games found for this user and title'});
    res.json(latestGame);
  } catch (err) {
    console.error('Error fetching latest game:', err);
    res.status(500).json({message: 'Error fetching latest game', error: err.message});
  }
};

export const getGameByTitleAndWeek = async (req, res) => {
  const { title, week } = req.params;

  try {
    const game = await Game.findOne({ title, week: parseInt(week, 10) });
    if (!game) return res.status(404).json({ message: 'Game not found.' });

    res.status(200).json(game);
  } catch (err) {
    console.error('Error fetching game by title and week:', err);
    res.status(500).json({ message: 'Error fetching game by title and week.', error: err.message });
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
    if (!game) return res.status(404).json({ message: 'Game not found.' });
    res.json(game);
  } catch (err) {
    console.error('Error fetching game by ID:', err);
    res.status(500).json({ message: 'Error fetching game by ID.', error: err.message });
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
  console.log('Incoming request to create game:', req.body);
  try {
    const { user_id, title, description, abundance, scarcity } = req.body;

    if (!user_id || !title || !description || !abundance || !scarcity) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user exists in the database
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

      const newGame = new Game({ user_id, title, description });
      const savedGame = await newGame.save();

      const initialStats = new Stats({
        game_id: savedGame._id,
        week: 1,
        abundance,
        scarcity,
      });
      await initialStats.save();

    res.status(201).json({ message: 'Game created successfully.', game: savedGame, stats: initialStats });
  } catch (err) {
    console.error('Error creating game entry:', err);
    res.status(500).json({ message: 'Error creating game entry.', error: err.message });
  }
};

export const saveGameData = async (req, res) => {
  const { title, week } = req.params; // Extract title and week from the route parameters
  const updates = req.body; // Extract the data to be saved

  try {
    const game = await Game.findOneAndUpdate(
      { title, week: parseInt(week, 10) }, // Match the game by title and week
      { $set: updates }, // Apply the updates
      { new: true } // Return the updated document
    );

    if (!game) return res.status(404).json({ message: 'Game not found.' });

    res.json({ message: 'Game data updated successfully.', game });
  } catch (err) {
    console.error('Error saving game data:', err);
    res.status(500).json({ message: 'Error saving game data.', error: err.message });
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
  const actionData = req.body; // Extract the data to be saved

  // Validate required parameters
  if (!title || !week) {
    return res.status(400).json({ message: 'Both title and week parameters are required.' });
  }

  try {
    // Find the specific game entry by title and week
    const game = await Game.findOne({ title, week: parseInt(week, 10) });
    if (!game) return res.status(404).json({ message: 'Game not found' });

    // Update the relevant fields in the game document
    Object.assign(game, actionData);

    // Save the updated game document
    await game.save();

    res.status(200).json({ message: 'Action data saved successfully', game });
  } catch (err) {
    console.error('Error saving action data:', err);
    res.status(500).json({ message: 'Error saving action data', error: err.message });
  }
};

//FIXME: Old version
// export const saveActionData = async (req, res) => {
//   const { title, week } = req.params; // Extract title and week from the route parameters
//     if (!week)
//       return res.status(400).json({ error: 'Week parameter is required' }); // Validate week
//   const actionData = req.body; // Extract the data to be saved

//   try {
//     // Find the specific game entry by title and week
//     const game = await Game.findOne({ title, week });
//     if (!game) return res.status(404).json({ message: 'Game not found' });

//     // Update the relevant fields in the game document
//     Object.assign(game, actionData); // Update the game document with the new data
//     // prompt specific
//     if (actionData.p_discussion) game.p_discussion = actionData.p_discussion;
//     if (actionData.p_discovery) game.p_discovery = actionData.p_discovery;
//     if (actionData.pp_title) game.pp_title = actionData.pp_title;
//     if (actionData.pp_desc) game.pp_desc = actionData.pp_desc;
//     if (actionData.pp_weeks) game.pp_weeks = actionData.pp_weeks;

//     // General game action fields
//     if (actionData.discussion) game.discussion = actionData.discussion;
//     if (actionData.discovery) game.discovery = actionData.discovery;
//     if (actionData.project_title) game.project_title = actionData.project_title;
//     if (actionData.project_desc) game.project_desc = actionData.project_desc;
//     if (actionData.project_weeks) game.project_weeks = actionData.project_weeks;
    

//     // Save the updated game document
//     await game.save();

//     res.status(200).json({ message: 'Prompt data saved successfully', game });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

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


// Projects

// Fetch all projects and personal projects for a game by title
export const getAllProjectsByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const gameEntries = await Game.find({ title }).sort({ week: 1 });
    const projects = [];
    const pp = [];

    gameEntries.forEach((entry) => {
      if (entry.project_title) {
        projects.push({
          title: entry.project_title,
          desc: entry.project_desc,
          weeks: entry.project_weeks,
          type: 'projects',
        });
      }
      if (entry.pp_title) {
        pp.push({
          title: entry.pp_title,
          desc: entry.pp_desc,
          weeks: entry.pp_weeks,
          type: 'pp',
        });
      }
    });

    res.json({ projects, pp });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Fetch completed projects
export const getCompletedProjects = async (req, res) => {
  const { title } = req.params;
  try {
    const gameEntries = await Game.find({ title, $or: [{ project_resolve: { $exists: true } }, { pp_resolve: { $exists: true } }] }).sort({ updatedAt: 1 });
    const completed = [];

    gameEntries.forEach((entry) => {
      if (entry.project_resolve) {
        completed.push({
          title: entry.project_title,
          desc: entry.project_desc,
          resolution: entry.project_resolve,
        });
      }
      if (entry.pp_resolve) {
        completed.push({
          title: entry.pp_title,
          desc: entry.pp_desc,
          resolution: entry.pp_resolve,
        });
      }
    });

    res.json(completed);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching completed projects', error: err.message });
  }
};

// Resolve a project
export const resolveProject = async (req, res) => {
  const { title, projectTitle, type } = req.params;
  const { resolution } = req.body;

  try {
    const updateField = type === 'projects' ? 'project_resolve' : 'pp_resolve';
    const filter = type === 'projects' ? { project_title: projectTitle } : { pp_title: projectTitle };

    const game = await Game.findOneAndUpdate(
      { title, ...filter },
      { [updateField]: resolution },
      { new: true }
    );

    if (!game) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project resolved successfully', game });
  } catch (err) {
    res.status(500).json({ message: 'Error resolving project', error: err.message });
  }
};