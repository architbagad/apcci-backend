export const swaggerConfig = {
    openapi: "3.0.0",
    info: {
        title: "APCCI Backend API",
        description: "API documentation for the APCCI backend",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Development server"
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
    paths: {
        "/user/register": {
            post: {
                summary: "Register a new user",
                tags: ["User"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    username: { type: "string" },
                                    password: { type: "string" }
                                },
                                required: ["username", "password"]
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "User registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        success: { type: "boolean" },
                                        message: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    400: { description: "Bad request, missing fields" },
                    500: { description: "Internal server error" }
                }
            },
        }
    }
};

export const swaggerUiConfig = {
    customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .scheme-container { display: none; }
        .swagger-ui .opblock-tag.no-desc span { font-weight: bold; }
    `,
    customSiteTitle: "APCCI Backend API Documentation",
    customfavIcon: "/favicon.ico",
    deepLinking: true,
    displayOperationId: true,
    docExpansion: "none",
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
};

export const swaggerUiPath = "/docs";
export const swaggerJsonPath = "/swagger.json";

export const swaggerBindings = {
    DATABASE_URL: "prisma://accelerate.prisma-data.net/?api_key=your_api_key_here",
    ARGON2_SECRET: "your_argon2_secret_here",
    JWT_SECRET: "your_jwt_secret_here",
    NPM_PACKAGE_VERSION: "1.0.0"
};

export const swaggerBindingsType = {
    DATABASE_URL: "string",
    ARGON2_SECRET: "string",
    JWT_SECRET  : "string",
    NPM_PACKAGE_VERSION: "string"
};