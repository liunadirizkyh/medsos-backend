import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // Menggunakan path absolute agar bisa dibaca saat di-deploy di Vercel
  apis: [path.join(__dirname, '../routes/*.js')], 
};

export const swaggerSpec = swaggerJsdoc(options);
