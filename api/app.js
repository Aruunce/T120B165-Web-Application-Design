const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('./config/swaggerOptions');

const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const voteRoutes = require('./routes/vote');
const likeRetweetRoutes = require('./routes/likeRetweet');
const followRoutes = require('./routes/follow');
const answerRoutes = require('./routes/answer');

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const swaggerSpec = swaggerJsDoc();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

app.use('/api', userRoutes);
app.use('/api', roleRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', voteRoutes);
app.use('/api', likeRetweetRoutes);
app.use('/api', followRoutes);
app.use('/api', answerRoutes);

app.use(errorMiddleware);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
