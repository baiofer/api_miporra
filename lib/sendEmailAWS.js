import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";



export async function sendMailAWS(to, subject, html) {
    // Configura las credenciales de AWS
    const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    // Configura las opciones de correo electrónico
    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: html,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: process.env.EMAIL_SERVICE_FROM,
    };

    console.log('Envio email: ')
    // Enviar un email
    const sendEmailCommand = new SendEmailCommand(params);
    try {
        const result = await sesClient.send(sendEmailCommand);
        console.log('Email enviado')
        return result;
    } catch (error) {
        console.log(error.message);
    }
}