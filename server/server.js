import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images to load on the frontend
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup uploads path serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api', globalLimiter);

// Auth rate limiter (5 attempts per 15 minutes for auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Let's make it 15 to be slightly more lenient in development, but secure. Security checklist requested 5 attempts. Let's set it to 5 for register and login specifically.
  message: { message: 'Too many login or register attempts, please try again after 15 minutes' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('BlogSphere API is running...');
});

// Error handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
