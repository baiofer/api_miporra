import { emailTransportConfigure } from "./emailTransportConfigure.js";


export async function sendMail(to, subject, text) {
  // Create a transport
  const transport = await emailTransportConfigure()

  // Send an email
  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to: to,
    subject: subject,
    text: text
    // html: cuerpo  // para enviar html
  })

  return result
}


