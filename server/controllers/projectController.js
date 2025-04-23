import Project from '../models/projectSchema.js';

export const getAllProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

export const createProject = async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  res.json(newProject);
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
};

export const updateProject = async (req, res) => {
  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProject);
};

export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project deleted' });
};
