import nodemailer from 'nodemailer'

export async function emailTransportConfigure() {

    // Entorno desarrollo
    const testAccount = await nodemailer.createTestAccount()

    const developmentTransport = {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    }

    // Entorno producción
    const productionTransport = {
        service: process.env.EMAIL_SERVICE_NAME,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS
        }
    }

    // Uso la configuración del entorno en el que me encuentro.
    const activeTransport = process.env.NODE_ENV === 'development' ? developmentTransport : productionTransport
    const transport = nodemailer.createTransport(activeTransport)

    return transport
} 