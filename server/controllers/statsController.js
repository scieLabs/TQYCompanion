import Stats from '../models/statsSchema.js';
import Project from '../models/projectSchema.js';

export const getStatsByGameAndWeek = async (req, res) => {
  const { game_id, week } = req.params;

  try {
    const stats = await Stats.findOne({ game_id, week });
    if (!stats) return res.status(404).json({ message: 'Stats not found.' });
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Error fetching stats.', error: err.message });
  }
};

//Should fetch data for all weeks of a game for the GameSummary component
//It should only be used once per game, when the summary is opened and thus created
export const getStatsByGame = async (req, res) => {
  const { game_id } = req.params;

  try {
    const stats = await Stats.find({ game_id }).sort({ week: 1 }); 
    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: 'No stats found for this game.' });
    }
    res.json(stats);
  } catch (err) {
    console.error('Error fetching stats by game:', err);
    res.status(500).json({ message: 'Error fetching stats by game.', error: err.message });
  }
};

export const createStatsEntry = async (req, res) => {
  const { game_id, week, abundance, scarcity, contempt } = req.body;

  try {
    const newStats = new Stats({ game_id, week, abundance, scarcity, contempt });
    const savedStats = await newStats.save();
    res.status(201).json(savedStats);
  } catch (err) {
    console.error('Error creating stats entry:', err);
    res.status(500).json({ message: 'Error creating stats entry.', error: err.message });
  }
};

// export const saveActionData = async (req, res) => {
//     const { game_id, week } = req.params;
//     const updates = req.body;

//     try {
//       const stats = await Stats.findOneAndUpdate(
//         { game_id, week },
//         { $set: updates },
//         { new: true }
//       );

//       if (!stats) return res.status(404).json({ message: 'Stats not found.' });
//       res.json(stats);
//     } catch (err) {
//       console.error('Error saving action data:', err);
//       res.status(500).json({ message: 'Error saving action data.', error: err.message });
//     }
//   };
export const saveActionData = async (req, res) => {
  const {
    game_id,
    stats_week,
    discussion,
    discovery,
    p_discussion,
    p_discovery,
    project_title,
    project_desc,
    project_weeks,
    pp_title,
    pp_desc,
    pp_weeks,
  } = req.body;

  try {
    // Save to the stats schema
    if (discussion || discovery || p_discussion || p_discovery) {
      await Stats.findOneAndUpdate(
        { game_id, week: stats_week },
        {
          $set: {
            discussion,
            discovery,
            p_discussion,
            p_discovery,
          },
        },
        { new: true, upsert: true } // Create a new document if it doesn't exist
      );
    }

    // Save to the projects schema
    if (project_title || pp_title) {
      const newProject = new Project({
        game_id,
        stats_week,
        project_title,
        project_desc,
        project_weeks,
        pp_title,
        pp_desc,
        pp_weeks,
      });

      await newProject.save();
    }

    res.status(200).json({ message: 'Action data saved successfully.' });
  } catch (error) {
    console.error('Error saving action data:', error);
    res.status(500).json({ message: 'Error saving action data.', error: error.message });
  }
};


// Update stats by game and week
export const updateStatsByGameAndWeek = async (req, res) => {
  const { game_id, week } = req.params;
  const { abundance, scarcity, contempt } = req.body;

  try {
    // Find the stats entry for the given game and week
    const stats = await Stats.findOneAndUpdate(
      { game_id, week },
      { abundance, scarcity, contempt },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!stats) {
      return res.status(404).json({ message: 'Stats entry not found for the specified game and week.' });
    }

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ message: 'Error updating stats.', error: error.message });
  }
};