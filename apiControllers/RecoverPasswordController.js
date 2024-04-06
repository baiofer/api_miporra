import { sendMail } from "../lib/sendEmail.js"

class RecoverPasswordController {


    recoverPassword = async (req, res, next) => {
        try {
            sendMail(req.query.email, 'Cambiar su password', 'Para cambiar su password, acceda al siguiente link <a href=https://api.miporra.es/>Cambiar password</a>')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default RecoverPasswordController