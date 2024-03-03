class LoginController {

    login (req, res, next) {
        try {
            console.log('Login')
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default LoginController