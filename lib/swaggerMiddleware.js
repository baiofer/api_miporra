import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Swagger documentation
const swaggerOptions = {
    definition: {
        info:{
            version: "1.0.0",
            title: "Mi porra API",
            description: "API documentation for use",
            contact:{
                name: "Fernando Jarilla",
                url: "https://www.linkedin.com/in/fjarilla/"
            },
            servers: ["http://localhost:3200"]
        }
    },
    basePath: "/v1.0/",
    // APIs to document
    apis: ["../apiControllers/*.js"]
}

const spec = swaggerJsDoc(swaggerOptions)

export default (app) => {
    console.log(app.request)
    app.use('/v1.0/api-docs', swaggerUI.serve, swaggerUI.setup(spec))
}