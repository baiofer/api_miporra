import { sendEmail } from "../lib/sendEmail.js"

class RecoverPasswordController {


    recoverPassword = async (req, res, next) => {
        const to = 'fernando.jarilla@ikasle.aeg.eus'
        const subject = 'Email de prueba desde miporra.es'
        const html = '<p></p>Has solicitado resetear tu contraseña en la página miporra.es. Para realizar esta función selecciona <a href="https://miporra.es">este enlace</a></p>'

        try {
            const result = await sendEmail(to, subject, html)
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default RecoverPasswordController