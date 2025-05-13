import express from 'express';
import './db/db.js'; 
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import promptRoutes from './routes/promptRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to handle CORS and JSON parsing
// app.use(cors({
//     origin: process.env.CLIENT_URL, // frontend's URL
//     credentials: true, // Allow cookies and credentials
// }));
app.use(cors({
    origin: 'https://tqycompanion.netlify.app', // Allow requests from your frontend
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies

app.options('*', cors()); // Enable pre-flight requests for all routes
app.use('/users', userRoutes);
app.use('/prompts', promptRoutes);
app.use('/game', gameRoutes);
app.use('/stats', statsRoutes)
app.use('/projects', projectRoutes)
//FIXME: check if we have to change game to games in the route

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));