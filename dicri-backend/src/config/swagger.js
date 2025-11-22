const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API SGE-DICRI',
      version: '1.0.0',
      description: 'Documentación de la API para el Sistema de Gestión de Evidencias DICRI',
    },
    servers: [
      {
        url: 'http://localhost:3013',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Aquí le decimos dónde buscar los comentarios de documentación
  apis: ['./src/modules/**/*.routes.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;