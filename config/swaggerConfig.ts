import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Management API Documentation",
            version: "1.0.0",
            description:
                "This is the API documentation for the User Management application.",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local server",
            },
        ]
    },
    apis: ["./src/api/v1/routes/userRoutes.ts", "./src/api/v1/validate/userValidation.ts"], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};