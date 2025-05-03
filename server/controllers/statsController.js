import Stats from '../models/statsSchema.js';

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

export const saveActionData = async (req, res) => {
    const { game_id, week } = req.params;
    const updates = req.body;
  
    try {
      const stats = await Stats.findOneAndUpdate(
        { game_id, week },
        { $set: updates },
        { new: true }
      );
  
      if (!stats) return res.status(404).json({ message: 'Stats not found.' });
      res.json(stats);
    } catch (err) {
      console.error('Error saving action data:', err);
      res.status(500).json({ message: 'Error saving action data.', error: err.message });
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