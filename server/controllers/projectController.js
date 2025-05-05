import Project from '../models/projectSchema.js';

export const getProjectsByGame = async (req, res) => {
  const { game_id } = req.params;

  try {
    const projects = await Project.find({ game_id });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Error fetching projects.', error: err.message });
  }
};

//TODO: should include pp_* ??? and resolution?? as an update
export const createProject = async (req, res) => {
  const { game_id, title, description, weeks } = req.body;

  try {
    const newProject = new Project({
      game_id,
      title,
      description,
      project_weeks: weeks,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project.', error: error.message });
  }
};


// Fetch ongoing projects
export const getOngoingProjects = async (req, res) => {
  const { game_id } = req.params;

  try {
    const ongoingProjects = await Project.find({
      game_id,
      $or: [{ project_weeks: { $gt: 0 } }, { pp_weeks: { $gt: 0 } }],
    });

    res.status(200).json(ongoingProjects);
  } catch (error) {
    console.error('Error fetching ongoing projects:', error);
    res.status(500).json({ message: 'Error fetching ongoing projects.', error: error.message });
  }
};

// Fetch completed projects
export const getCompletedProjects = async (req, res) => {
  const { game_id } = req.params;

  try {
    const completedProjects = await Project.find({
      game_id,
      $or: [{ project_weeks: 0 }, { pp_weeks: 0 }],
    });

    res.status(200).json(completedProjects);
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    res.status(500).json({ message: 'Error fetching completed projects.', error: error.message });
  }
};

// Update project weeks
export const updateProjectWeeks = async (req, res) => {
  const { project_id } = req.params;
  const { project_weeks, pp_weeks } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      project_id,
      { project_weeks, pp_weeks },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project weeks:', error);
    res.status(500).json({ message: 'Error updating project weeks.', error: error.message });
  }
};

export const resolveProject = async (req, res) => {
  const { project_id } = req.params;
  const { resolution } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      project_id,
      { resolution, project_weeks: 0, pp_weeks: 0 },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error resolving project:', error);
    res.status(500).json({ message: 'Error resolving project.', error: error.message });
  }
};