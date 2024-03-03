import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Swagger documentation
const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            version: "1.0.0",
            title: "Mi porra API",
            description: "API documentation for use",
            contact:{
                name: "Fernando Jarilla",
                url: "https://www.miporra.es/"
            },
            servers: [{
                url: "http://localhost:3200/v1.0"
            }],
        },
        components: {
            schemas: {
                Clients: {
                    type: "object",
                    required: ["name", "email", "logo"],
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the client"
                        },
                        name: {
                            type: "string",
                            description: "The name of the client"
                        },
                        logo: {
                            type: "string",
                            description: "The logo of the client"
                        },
                        createdAt: {
                            type: "string",
                            description: "The day the client was added"
                        }
                    },
                    example: {
                        id: "d5fe_Asz",
                        logo: "/public/logo.png",
                        name: "Fernando Jarilla",
                        createdAt: "2024-03-03T09:43:06.157Z"
                    }
                }
            }
        }
    },
    // APIs to document
    apis: [path.resolve(__dirname, '../apiControllers/**/*.js')]
}

const spec = swaggerJsDoc(options)

export default (app) => {
    app.use('/v1.0/api-docs', swaggerUI.serve, swaggerUI.setup(spec))
}