const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopping MVP API",
      version: "1.0.0",
      description: "REST API for the Shopping MVP — products, cart, and orders",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            image_url: { type: "string" },
          },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer" },
            product_id: { type: "integer" },
            quantity: { type: "integer" },
            name: { type: "string" },
            price: { type: "number" },
            image_url: { type: "string" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            total: { type: "number" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
