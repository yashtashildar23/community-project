const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const helplineRoutes = require('./routes/helplines');
const articleRoutes = require('./routes/articles');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  })
);
app.use(express.json({ limit: '16kb' }));

// Public read-only API: generous limit, no IP persistence in app code.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again shortly.' },
});

app.get('/api/health', (req, res) =>
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
);

app.use('/api/helplines', apiLimiter, helplineRoutes);
app.use('/api/articles', apiLimiter, articleRoutes);

app.use((req, res) =>
  res.status(404).json({ success: false, error: 'Endpoint not found.' })
);

// Centralized error handler.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : error.message,
  });
});

module.exports = app;
