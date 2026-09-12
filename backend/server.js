const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
// const errorHandler = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const otpRoutes = require('./routes/otpRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    }
));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Error handling middleware
// app.use(errorHandler);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Saraswati College API Running 🚀',
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.listen(process.env.PORT , () => {
    console.log(`Server running on port ${process.env.PORT}`);
});