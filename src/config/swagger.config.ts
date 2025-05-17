import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Red Social API',
      version: '1.0.0',
      description: 'API para una aplicación de red social',
      contact: {
        name: 'Soporte',
        email: 'support@redsocial.com'
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.redsocial.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './src/**/*.router.ts', 
    './src/**/*.controller.ts', 
    './src/**/*.entity.ts',
    './src/**/*.service.ts',
    './src/**/*.schema.ts' // Asegúrate de incluir los archivos de esquemas
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
