import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


export async function sendMailAWS(to, subject, html) {
    // Configuring AWS credentials
    const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    // Configuring email options
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
    // Sending email
    const sendEmailCommand = new SendEmailCommand(params);
    try {
        const result = await sesClient.send(sendEmailCommand);
        console.log('Email enviado')
        return result;
    } catch (error) {
        console.log(error.message);
    }
}