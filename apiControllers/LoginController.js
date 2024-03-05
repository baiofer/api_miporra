class LoginController {

    login (req, res, next) {
        try {
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default LoginController