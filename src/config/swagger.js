const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API',
      version: '1.0.0',
      description: 'REST API for the Job Portal platform — seekers, employers, and job management.',
    },
    servers: [
      { url: 'http://api.precisionsystem.in', description: 'Local development' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Seeker / admin JWT (Authorization: Bearer <token>)',
        },
        EmployerBearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Employer sub-user JWT issued by POST /api/v1/employer/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Seeker / user authentication' },
      { name: 'Employer Auth', description: 'Employer sub-user authentication' },
      { name: 'Employer Profile', description: 'Company profile management' },
      { name: 'Employer Roles', description: 'Role & permission management' },
      { name: 'Employer Users', description: 'Sub-user management' },
      { name: 'Jobs', description: 'Job postings — public search and employer CRUD' },
      { name: 'Seeker Profile', description: 'Seeker profile, experience, education, skills' },
      { name: 'Seeker Applications', description: 'Job applications' },
      { name: 'Search', description: 'Job search, saved jobs, alerts, candidate search' },
      { name: 'Master Data', description: 'Reference / lookup data (industries, skills, cities …)' },
      { name: 'Health', description: 'Service health check' },
    ],
  },
  apis: ['./src/docs/**/*.yaml'],
};

module.exports = swaggerJsdoc(options);
