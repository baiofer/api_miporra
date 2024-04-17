import jwt from 'jsonwebtoken'
import createError from "http-errors"

export async function jwtAuthMiddleware(req, res, next) {
    try {
        // When we have a Swagger request, the token cames alone, but when the request cames fron Axios, the token cames as "Bearer token". So we delete the Bearer word in order to have only the token.
        const jwtTok = (req.get('Authorization') || req.body.jwt || req.query.jwt)
        let jwtToken = ""
        if (jwtTok[0] === "B") {
            jwtToken = jwtTok.split(' ')[1]
        } else {
            jwtToken = jwtTok
        }
        if (!jwtToken) {
            next(createError(401, "No token provided"))
            return
        }
        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                console.log(payload)
                next(createError(401, "Invalid token"))
                return
            }
            req.userLoggedApi = payload.id 
            next()
        })
    } catch (error) {
        console.log('JWT auth error: ', error)
        next(error)
    }
}