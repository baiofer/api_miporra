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
        },
        servers: [
            {
                url: "https://api.miporra.es/",
                description: "Remote server"
            },
            {
                url: "http://localhost:3200/",
                description: "Local server"
            }
        ],
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
                        email: {
                            type: "string",
                            description: "The email of the client"
                        },
                        password: {
                            type: "string",
                            description: "The password of the client"
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
                        name: "Fernando Jarilla",
                        email: "fernando@miporra.es",
                        password: "123456",
                        logo: "/public/logo.png",
                        createdAt: "2024-03-03T09:43:06.157Z"
                    }
                },
                Lottery: {
                    type: "object",
                    required: ["clientId", "firstNumber", "totalNumbers", "dateOfLottery", "dateLimitOfBets", "betPrice", "howToWin", "lotteryPrize"],
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the lottery."
                        },
                        clientId: {
                            type: "string",
                            description: "Client who open the lottery."
                        },
                        firstNumber: {
                            type: "string",
                            description: "First number of the lottery."
                        },
                        totalNumbers: {
                            type: "string",
                            description: "Total numbers of the lottery."
                        },
                        dateOfLottery: {
                            type: "string",
                            description: "Date of Lottery."
                        },
                        dateLimitOfBets: {
                            type: "string",
                            description: "Limit date for bets."
                        },
                        betPrice: {
                            type: "string",
                            description: "Price of the bet."
                        },
                        howToWin: {
                            type: "string",
                            description: "Conditions to win."
                        },
                        lotteryPrize: {
                            type: "string",
                            description: "The price of the bet"
                        },
                    },
                    example: {
                        id: "d5fe_Asz",
                        clientId: "hyxyjklkhs",
                        firstNumber: "1",
                        totalNumbers: "100",
                        dateOfLottery: "30/03/2024",
                        dateLimitsOfBets: "29/03/2024",
                        betPrice: "1",
                        whoToWin: "Dos últimas cifras del sorteo de la ONCE del 30/03/2024",
                        lotteryPrize: "Lote de ibéricos",
                    }
                },
                LotteryBet: {
                    type: "object",
                    required: ["lotteryId", "userEmail", "userName", "selectedNumber", "betDate", "betPrice"],
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the lottery."
                        },
                        lotteryId: {
                            type: "string",
                            description: "Lottery id to make the bet."
                        },
                        userEmail: {
                            type: "string",
                            description: "Email of the person who make the bet."
                        },
                        userName: {
                            type: "string",
                            description: "Name of the person who make the bet."
                        },
                        selectedNumber: {
                            type: "string",
                            description: "Number selected."
                        },
                        betDate: {
                            type: "string",
                            description: "Date of the bet."
                        },
                        betPrice: {
                            type: "string",
                            description: "Price of the bet."
                        },
                    },
                    example: {
                        id: "d5fe_Asz",
                        lotteryId: "efgklxf",
                        userEmail: "100",
                        userName: "30/03/2024",
                        selectedNumber: "29/03/2024",
                        betDate: "1",
                        betPrice: "Dos últimas cifras del sorteo de la ONCE del 30/03/2024",
                    }
                },
                Club: {
                    type: "object",
                    required: ["clubId", "match1HomeTeam", "match1AwayTeam", "match2HomeTeam", "match2AwayTeam", "match1Date", "match1Hour", "match2Date", "match2Hour", "betPrice", "accumulatedPrize", "accunulatedJackpot", "limitDateForBets", "limitHourForBets", "state", "numberOfWinners"],
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the lottery."
                        },
                        match1HomeTeam: {
                            type: "string",
                            description: "Match 1. Home Team."
                        },
                        match1AwayTeam: {
                            type: "string",
                            description: "Match 1. Away team."
                        },
                        match1Date: {
                            type: "string",
                            format: "date",
                            description: "Match 1. Date."
                        },
                        match1Hour: {
                            type: "string",
                            description: "Match 1, Hour."
                        },
                        match2HomeTeam: {
                            type: "string",
                            description: "Match 2. Home team."
                        },
                        match2AwayTeam: {
                            type: "string",
                            description: "Match 2. Away team."
                        },
                        match2Date: {
                            type: "string",
                            format: "date",
                            description: "Match 2. Date."
                        },
                        match2Hour: {
                            type: "string",
                            description: "Match 2. Hour."
                        },
                        betPrice: {
                            type: "number",
                            description: "Price of the bet."
                        },
                        accumulatedPrize: {
                            type: "number",
                            description: "Accumulated money in this club."
                        },
                        accumulatedJackpot: {
                            type: "number",
                            description: "Accumulated money from previous matches."
                        },
                        limitDateForBets: {
                            type: "string",
                            format: "date",
                            description: "Limit date to make bets."
                        },
                        limitHourForBets: {
                            type: "string",
                            description: "Limit hour to make bets."
                        },
                        state: {
                            type: "string",
                            enum: ['in progress', 'finished'],
                            description: "State of the bet (in progress / finished)."
                        },
                        numberOfWinners: {
                            type: "number",
                            description: "Number of winners."
                        },
                    },
                    example: {
                        id: "d5fe_Asz",
                        clubId: "jjsttghnmw6",
                        match1HomeTeam: "Sevilla",
                        match1AwayTeam: "Betis",
                        match2HomeTeam: "Español",
                        match2AwayTeam: "Barcelona",
                        match1Date: "02/03/2024",
                        match1Hour: "18:30",
                        match2Date: "02/03/2024",
                        match2Hour: "21:00",
                        betPrice: "1",
                        accumulatedPrize: "23",
                        accumulatedJackpot: "117",
                        limitDateForBets: "02/03/24",
                        limitHourForBets: "18:00",
                        state: true,
                        numberOfWinners: "0",
                    }
                },
                ClubBet: {
                    type: "object",
                    required: ["clubId", "userEmail", "userName", "match1HomeTeamResult", "match1AwayTeamResult", "match2HomeTeamResult", "match2AwayTeamResult", "betDate", "betPrice"],
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the lottery."
                        },
                        clubId: {
                            type: "string",
                            description: "Club id to make the bet."
                        },
                        userEmail: {
                            type: "string",
                            description: "Email of the person who make the bet."
                        },
                        userName: {
                            type: "string",
                            description: "Name of the person who make the bet."
                        },
                        match1HomeTeamResult: {
                            type: "string",
                            description: "Match 1. Home team number of goals."
                        },
                        match1AwayTeamResult: {
                            type: "string",
                            description: "Match 1. Away team number of goals."
                        },
                        match2HomeTeamResult: {
                            type: "string",
                            description: "Match 2. Home team number of goals."
                        },
                        match2AwayTeamResult: {
                            type: "string",
                            description: "Match 2. Away team number of goals.."
                        },
                        betDate: {
                            type: "string",
                            description: "Date of the bet is made."
                        },
                        betPrice: {
                            type: "string",
                            description: "Price of the bet."
                        },
                    },
                    example: {
                        id: "d5fe_Asz",
                        clubId: "efgklxf",
                        userEmail: "user2@user.com",
                        userName: "Marcelo",
                        match1HomeTeamResult: "2",
                        match1AwayTeamResult: "0",
                        match2HomeTeamResult: "1",
                        match2AwayTeamResult: "3",
                        betDate: "27/02/2024",
                        betPrice: "1",
                    }
                },
            },
            securitySchemes: {
                JWTAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: "JWT obtained after successful login."
                }
            }
        }
    },
    // APIs to document
    apis: [
        path.resolve(__dirname, '../apiControllers/**/*.js'),
    ]
}

const spec = swaggerJsDoc(options)

export default (app) => {
    app.use('/v1.0/api-docs', swaggerUI.serve, swaggerUI.setup(spec))
}