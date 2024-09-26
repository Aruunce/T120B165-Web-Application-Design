const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = () => {
  return swaggerJsDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Postoria API Documentation",
        version: "1.0.0",
        description: "API documentation for Postoria app",
      },
      servers: [
        {
          url: process.env.API_URL || 'http://localhost:3000/api',
        },
      ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],
  });
};

module.exports = swaggerOptions;
  