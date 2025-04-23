import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import statsRoutes from './routes/statRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/prompts', promptRoutes);
app.use('/games', gameRoutes);
app.use('/stats', statsRoutes);
app.use('/projects', projectRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));