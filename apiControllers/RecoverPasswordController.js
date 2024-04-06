import { sendMail } from "../lib/sendEmail.js"

class RecoverPasswordController {


    recoverPassword = async (req, res, next) => {
        console.log('Envio un correo')
        try {
            sendMail('fjarilla64@gmail.com', 'Prueba de email', 'Este es el texto del email')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default RecoverPasswordController