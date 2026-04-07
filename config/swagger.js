import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medsos API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi lengkap untuk API aplikasi media sosial Medsos',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Sesuai dengan port di server.js
        description: 'Development Server',
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
  apis: ['./routes/*.js'], // Scan routes for JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
