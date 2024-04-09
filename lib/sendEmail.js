import axios from 'axios'
import qs from 'qs'


export async function sendEmail(to, subject, html) {
    try {
        const apiKey = process.env.MAILGUN_API_KEY;
        const domain = 'mail.miporra.es'
        const url = `https://api.eu.mailgun.net/v3/${domain}/messages`;

        const datosCorreo = {
            from: 'miporra@gmail.com',
            to: to,
            subject: subject,
            html: html
        };

        const auth = {
            username: 'api',
            password: apiKey
        }

        const respuesta = await axios({
            method: 'post',
            url: url,
            data: qs.stringify(datosCorreo),
            auth: auth, 
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Correo enviado con éxito:', respuesta.data);
    } catch (error) {
        console.error('Error al enviar el correo:', error.response.data);
    }
}
