import jwt from 'jsonwebtoken'
import createError from "http-errors"

export async function jwtAuthMiddleware(req, res, next) {
    console.log('JWT AUTH')
    try {
        const jwtToken = req.get('Authorization') || req.body.jwt || req.query.jwt
        if (!jwtToken) {
            next(createError(401, "No token provided"))
            return
        }
        jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                next(createError(401, "Invalid token"))
                return
            }
            req.userLoggedApi = payload.id 
            next()
        })
    } catch (error) {
        next(error)
    }
}