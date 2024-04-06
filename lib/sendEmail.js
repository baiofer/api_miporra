import { emailTransportConfigure } from "./emailTransportConfigure.js";
import nodemailer from 'nodemailer'


export async function sendMail(to, subject, text) {
  // Crear un transport
  const transport = await emailTransportConfigure()

  // Enviar un email
  const result = await transport.sendMail({
    from: process.env._EMAIL_SERVICE_FROM,
    to: to,
    subject: subject,
    text: text
    // html: cuerpo  // para enviar html
  })
  console.log('URL de previsualización: ', nodemailer.getTestMessageUrl(result))
  return result
}


