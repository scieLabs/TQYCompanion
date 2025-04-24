import express from 'express';
import './db/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/prompts', promptRoutes);
app.use('/games', gameRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));