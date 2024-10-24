import swaggerJSDoc from "swagger-jsdoc";
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for ZandoFitness",
    version: "1.0.0",
    description: "This is a REST API application made with Express.",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Development server",
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./apiComponents.ts"],
};
export const swaggerSpec = swaggerJSDoc(options);
