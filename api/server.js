const app = require("./app");
const dotenv = require("dotenv");

// Setting up config file
dotenv.config({ path: "api/config/config.env" });

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('./config/swaggerOptions');

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

const swaggerSpec = swaggerJsDoc();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
