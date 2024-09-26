const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = () => {
  return swaggerJsDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Your API",
        version: "1.0.0",
        description: "API documentation for your Express app",
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3000/api', // Default to localhost if API_URL is not set
        },
      ],
    },
    apis: [path.join(__dirname, '../routes/*.js')], // Adjust this path to where your route files are located
  });
};

module.exports = swaggerOptions;
  