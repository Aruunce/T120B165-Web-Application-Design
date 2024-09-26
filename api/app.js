const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('./config/swaggerOptions');

// Import routes
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');


const errorMiddleware = require('./middlewares/errors');

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(cors());

const swaggerSpec = swaggerJsDoc();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

app.use(errorMiddleware);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler (optional: if you want to use a custom error handling middleware)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
