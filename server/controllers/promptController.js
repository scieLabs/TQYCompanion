import Prompt from '../models/promptSchema.js';
import Game from '../models/gameSchema.js';
import mongoose from 'mongoose';
import Stats from '../models/statsSchema.js';

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

//TODO: this one has 13 prompts hardcoded, missing logic for game over
export const getNextPrompt = async (req, res) => {
  const { game_id, currentSeason } = req.body;

  try {
    console.log(`Incoming request to getNextPrompt: game_id=${game_id}, currentSeason=${currentSeason}`);
    // Fetch the game to get the shownPrompts list
    const game = await Game.findById(game_id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    const shownPrompts = game.shownPrompts || [];
    console.log(`Shown prompts for game ${game_id}:`, shownPrompts);

    // Fetch all prompts for the current season
    const allSeasonPrompts = await Prompt.find({ season: currentSeason });
    console.log(`Total prompts for ${currentSeason}:`, allSeasonPrompts.length);

    // Check if all 13 prompts for the current season have been shown
    if (shownPrompts.length >= 13) {
      console.log(`All 13 prompts for ${currentSeason} exhausted. Transitioning to next season.`);

      // Transition to the next season
      const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
      const currentSeasonIndex = seasons.indexOf(currentSeason);

      if (currentSeasonIndex === -1) {
        return res.status(400).json({ message: 'Invalid current season.' });
      }

      const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length];

      // Reset shownPrompts for the new season and update the currentSeason in the Game document
      const updatedGame = await Game.findByIdAndUpdate(
        game_id,
        { shownPrompts: [], currentSeason: nextSeason }, // Update currentSeason here
        { new: true }
      );

      console.log(`Updated game for season transition:`, updatedGame);

      // Fetch prompts for the next season
      const nextSeasonPrompts = await Prompt.find({ season: nextSeason });

      if (nextSeasonPrompts.length > 0) {
        const randomIndex = Math.floor(Math.random() * nextSeasonPrompts.length);
        const selectedPrompt = nextSeasonPrompts[randomIndex];

        // Atomically update the shownPrompts list in the database
        console.log(`Adding prompt ${selectedPrompt._id} to shownPrompts for game ${game_id}`);
        const updatedGameWPrompt = await Game.findByIdAndUpdate(
          game_id,
          { $addToSet: { shownPrompts: selectedPrompt._id } },
          { new: true }
        );
        console.log(`Updated shownPrompts for game ${game_id}:`, updatedGameWPrompt.shownPrompts);

        console.log(`Selected prompt for ${nextSeason}: ${selectedPrompt._id}`);
        return res.status(200).json({
          prompt: {
            ...selectedPrompt.toObject(),
            isProject: selectedPrompt.isProject || false,
            isDiscussion: selectedPrompt.isDiscussion || false,
            isDiscovery: selectedPrompt.isDiscovery || false,
          },
          season: nextSeason,
        });
      }

      return res.status(404).json({ message: 'No prompts available for the next season.' });
    }

    // Filter remaining prompts for the current season
    const remainingPrompts = allSeasonPrompts.filter(
      (prompt) => !shownPrompts.includes(prompt._id)
    );
    console.log(`Remaining prompts for ${currentSeason}:`, remainingPrompts.length);

    if (remainingPrompts.length > 0) {
      // Select a random prompt from the remaining prompts
      const randomIndex = Math.floor(Math.random() * remainingPrompts.length);
      const selectedPrompt = remainingPrompts[randomIndex];

      // Atomically update the shownPrompts list in the database
      console.log(`Adding prompt ${selectedPrompt._id} to shownPrompts for game ${game_id}`);
      const updatedGame = await Game.findByIdAndUpdate(
        game_id,
        { $addToSet: { shownPrompts: selectedPrompt._id } },
        { new: true }
      );
      console.log(`Updated shownPrompts for game ${game_id}:`, updatedGame.shownPrompts);

    //   console.log(`Selected prompt: ${selectedPrompt._id}`);
    //   return res.status(200).json({ prompt: selectedPrompt, season: currentSeason });
    // }
      return res.status(200).json({
        prompt: {
          ...selectedPrompt.toObject(),
          isProject: selectedPrompt.isProject || false,
          isDiscussion: selectedPrompt.isDiscussion || false,
          isDiscovery: selectedPrompt.isDiscovery || false,
        },
        season: currentSeason,
      });
    }

    return res.status(404).json({ message: 'No remaining prompts for the current season.' });
  } catch (error) {
    console.error('Error fetching next prompt:', error);
    res.status(500).json({ message: 'Error fetching next prompt.', error: error.message });
  }
};

//FIXME: before hardcoding 13
// export const getNextPrompt = async (req, res) => {
//   const { game_id, currentSeason } = req.body;

//   try {
//     // Fetch the game to get the shownPrompts list
//     const game = await Game.findById(game_id);

//     if (!game) {
//       return res.status(404).json({ message: 'Game not found.' });
//     }

//     const shownPrompts = game.shownPrompts || [];
//     console.log(`Shown prompts before update for game ${game_id}:`, shownPrompts);

//     // Fetch all prompts for the current season
//     const allSeasonPrompts = await Prompt.find({ season: currentSeason });
//     console.log(`Total prompts for ${currentSeason}:`, allSeasonPrompts.length);

//     // Check if all prompts for the current season have been shown
//     const remainingPrompts = allSeasonPrompts.filter(
//       (prompt) => !shownPrompts.includes(prompt._id)
//     );
//     console.log(`Remaining prompts for ${currentSeason}:`, remainingPrompts.length);

//     if (remainingPrompts.length > 0) {
//       // Select a random prompt from the remaining prompts
//       const randomIndex = Math.floor(Math.random() * remainingPrompts.length);
//       const selectedPrompt = remainingPrompts[randomIndex];

//       // Atomically update the shownPrompts list in the database
//       await Game.findByIdAndUpdate(
//         game_id,
//         { $push: { shownPrompts: selectedPrompt._id } },
//         { new: true }
//       );

//       console.log(`Selected prompt: ${selectedPrompt._id}`);
//       return res.status(200).json({ prompt: selectedPrompt, season: currentSeason });
//     }

//     if (remainingPrompts.length === 0) {
//       console.log(`All prompts for ${currentSeason} exhausted. Transitioning to next season.`);
//     }

//     // If no prompts are left in the current season, switch to the next season
//     const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//     const currentSeasonIndex = seasons.indexOf(currentSeason);
//     const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length];

//     console.log(`All prompts for ${currentSeason} exhausted. Transitioning to ${nextSeason}.`);

//     // Reset shownPrompts for the new season
//     await Game.findByIdAndUpdate(
//       game_id,
//       { shownPrompts: [] },
//       { new: true }
//     );

//     // Fetch prompts for the next season
//     const nextSeasonPrompts = await Prompt.find({ season: nextSeason });

//     if (nextSeasonPrompts.length > 0) {
//       const randomIndex = Math.floor(Math.random() * nextSeasonPrompts.length);
//       const selectedPrompt = nextSeasonPrompts[randomIndex];

//       // Atomically update the shownPrompts list in the database
//       await Game.findByIdAndUpdate(
//         game_id,
//         { $push: { shownPrompts: selectedPrompt._id } },
//         { new: true }
//       );

//       console.log(`Selected prompt for ${nextSeason}: ${selectedPrompt._id}`);
//       console.log(`Shown prompts before update for game ${game_id}:`, shownPrompts);
//       return res.status(200).json({ prompt: selectedPrompt, season: nextSeason });
//     }

//     // If no prompts are left in any season, return the Game Over prompt
//     const gameOverPrompt = await Prompt.findOne({ _id: '6809feda210f991dba3d9c70' });
//     if (gameOverPrompt) {
//       console.log('Game over prompt encountered.');
//       return res.status(200).json({ prompt: gameOverPrompt, season: null });
//     }

//     return res.status(404).json({ message: 'No prompts available.' });
//   } catch (error) {
//     console.error('Error fetching next prompt:', error);
//     res.status(500).json({ message: 'Error fetching next prompt.', error: error.message });
//   }
// };

//FIXME: the new new previous version
// export const getNextPrompt = async (req, res) => {
//   const { game_id, currentSeason, shownPrompts } = req.body;

//   try {
//     // Fetch all prompts for the current season
//     const allSeasonPrompts = await Prompt.find({ season: currentSeason });

//     // Check if all prompts for the current season have been shown
//     const remainingPrompts = allSeasonPrompts.filter(
//       (prompt) => !shownPrompts.includes(prompt._id.toString())
//     );

//     if (remainingPrompts.length > 0) {
//       // Select a random prompt from the remaining prompts
//       const randomIndex = Math.floor(Math.random() * remainingPrompts.length);
//       const selectedPrompt = remainingPrompts[randomIndex];

//       return res.status(200).json({ prompt: selectedPrompt, season: currentSeason });
//     }

//     // If no prompts are left in the current season, switch to the next season
//     const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//     const currentSeasonIndex = seasons.indexOf(currentSeason);
//     const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length];

//     // Fetch prompts for the next season
//     const nextSeasonPrompts = await Prompt.find({
//       season: nextSeason,
//       _id: { $nin: shownPrompts },
//     });

//     if (nextSeasonPrompts.length > 0) {
//       const randomIndex = Math.floor(Math.random() * nextSeasonPrompts.length);
//       const selectedPrompt = nextSeasonPrompts[randomIndex];

//       return res.status(200).json({ prompt: selectedPrompt, season: nextSeason });
//     }

//     // If no prompts are left in any season, return the Game Over prompt
//     const gameOverPrompt = await Prompt.findOne({ _id: '6809feda210f991dba3d9c70' });
//     if (gameOverPrompt) {
//       return res.status(200).json({ prompt: gameOverPrompt, season: null });
//     }

//     return res.status(404).json({ message: 'No prompts available.' });
//   } catch (error) {
//     console.error('Error fetching next prompt:', error);
//     res.status(500).json({ message: 'Error fetching next prompt.', error: error.message });
//   }
// };

//FIXME: second to last iteration
// export const getNextPrompt = async (req, res) => {
//   const { game_id, currentSeason, shownPrompts } = req.body;

//   try {
//     // Fetch all prompts for the current season that haven't been shown
//     const availablePrompts = await Prompt.find({
//       season: currentSeason,
//       _id: { $nin: shownPrompts }, // Exclude already shown prompts
//     });

//     if (availablePrompts.length > 0) {
//       // Select a random prompt
//       const randomIndex = Math.floor(Math.random() * availablePrompts.length);
//       const selectedPrompt = availablePrompts[randomIndex];

//       return res.status(200).json({ prompt: selectedPrompt, season: currentSeason });
//     }

//     // If no prompts are left in the current season, switch to the next season
//     const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//     const nextSeasonIndex = (seasons.indexOf(currentSeason) + 1) % seasons.length;
//     const nextSeason = seasons[nextSeasonIndex];

//     // Fetch prompts for the next season
//     const nextSeasonPrompts = await Prompt.find({
//       season: nextSeason,
//       _id: { $nin: shownPrompts },
//     });

//     if (nextSeasonPrompts.length > 0) {
//       const randomIndex = Math.floor(Math.random() * nextSeasonPrompts.length);
//       const selectedPrompt = nextSeasonPrompts[randomIndex];

//       return res.status(200).json({ prompt: selectedPrompt, season: nextSeason });
//     }

//     // If no prompts are left in any season, return the Game Over prompt
//     const gameOverPrompt = await Prompt.findOne({ _id: '6809feda210f991dba3d9c70' });
//     if (gameOverPrompt) {
//       return res.status(200).json({ prompt: gameOverPrompt, season: null });
//     }

//     return res.status(404).json({ message: 'No prompts available.' });
//   } catch (error) {
//     console.error('Error fetching next prompt:', error);
//     res.status(500).json({ message: 'Error fetching next prompt.', error: error.message });
//   }
// };

// export const getNextPrompt = async (req, res) => {
//   const { season } = req.query;
//   const validSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//   const gameOverPromptId = '6809feda210f991dba3d9c70'; // Replace with the actual Game Over prompt ID

//   if (!season || !validSeasons.includes(season)) {
//     return res.status(400).json({ message: 'Invalid or missing season parameter.' });
//   }

//   try {
//     // Fetch all used prompt IDs from the stats schema
//     const usedPromptIds = (await Stats.find({}, 'prompt_id')).map((stat) => stat.prompt_id?.toString());

//     // Fetch prompts for the current season that have not been used
//     let prompts = await Prompt.find({ season, _id: { $nin: usedPromptIds } }).select(
//       'prompt_title prompt isDiscussion isDiscovery isProject season'
//     );

//     console.log(`Fetching prompts for season: ${season}, remaining prompts: ${prompts.length}`);

//     // If no prompts are available for the current season, move to the next season
//     let currentSeasonIndex = validSeasons.indexOf(season);
//     while (prompts.length === 0) {
//       currentSeasonIndex = (currentSeasonIndex + 1) % validSeasons.length;
//       const nextSeason = validSeasons[currentSeasonIndex];

//       // If we've cycled back to Spring and still no prompts, return a game-over response
//       if (nextSeason === 'Spring') {
//         return res.status(404).json({ message: 'No prompts available. Game over.' });
//       }

//       prompts = await Prompt.find({ season: nextSeason, _id: { $nin: usedPromptIds } }).select(
//         'prompt_title prompt isDiscussion isDiscovery isProject season'
//       );
//     }

//     // Select a random prompt
//     const randomIndex = Math.floor(Math.random() * prompts.length);
//     const selectedPrompt = prompts[randomIndex];

//     // Check if the selected prompt is the Game Over prompt
//     if (selectedPrompt._id.toString() === gameOverPromptId) {
//       return res.status(200).json({ message: 'Game over.', prompt: selectedPrompt });
//     }

//     // Return the selected prompt
//     res.json(selectedPrompt);
//   } catch (err) {
//     console.error('Error fetching prompts:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

// export const getNextPrompt = async (req, res) => {
//   const { season } = req.query;
//   const validSeasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//   const gameOverPromptId = '6809feda210f991dba3d9c70'; // Replace with the actual Game Over prompt ID

//   if (!season || !validSeasons.includes(season)) {
//     return res.status(400).json({ message: 'Invalid or missing season parameter.' });
//   }

//   try {
//     const prompts = await Prompt.find({ season });
//     // const prompts = await Prompt.find({ week: parseInt(week, 10) }); // Ensure week is parsed as a number
//     console.log('Fetching prompts for season:', season);
//     if (!prompts || prompts.length === 0) {
//       // If no prompts are available for the current season, move to the next season
//       const nextSeasonIndex = (validSeasons.indexOf(season) + 1) % validSeasons.length;
//       const nextSeason = validSeasons[nextSeasonIndex];

//       if (nextSeason === 'Spring') {
//         // If we've cycled back to Spring and still no prompts, return a game-over response
//         return res.status(404).json({ message: 'No prompts available. Game over.' });
//       }

//       return res.status(404).json({ message: `No prompts found for ${season}. Try ${nextSeason}.`, nextSeason });
//     }

//     // Select a random prompt
//     const randomIndex = Math.floor(Math.random() * prompts.length);
//     const selectedPrompt = prompts[randomIndex];

//     // Check if the selected prompt is the Game Over prompt
//     if (selectedPrompt._id.toString() === gameOverPromptId) {
//       return res.status(200).json({ message: 'Game over.', prompt: selectedPrompt });
//     }

//     res.json(selectedPrompt);
//   } catch (err) {
//     console.error('Error fetching prompts:', err);
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

//FIXME: old version
// export const getNextPrompt = async (req, res) => {
//   try {
//     const week = parseInt(req.query.week, 10); // Extract week from query parameters
//     const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
//     const season = seasons[Math.min(Math.floor((week - 1) / 13), 3)];

//     // Fetch all used prompt IDs from the Game model
//     const usedPromptIds = (await Game.find()).map(game => game.prompt_id.toString());

//     // Find the next available prompt for the current season
//     const prompt = await Prompt.findOne({ season, _id: { $nin: usedPromptIds } });

//     if (!prompt) return res.status(404).json({ message: 'No more prompts in this season' });
//     res.json(prompt);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

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
