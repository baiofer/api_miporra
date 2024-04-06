import nodemailer from 'nodemailer'
import aws from 'aws-sdk'

export async function emailTransportConfigure() {

    /*

    // Development environment
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
    */
    // Production environment
    /*const productionTransport = {
        service: process.env.EMAIL_SERVICE_NAME,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS
        }
    }*/
    /*
    // Configuration of AWS credentials
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    // Create a SES object of AWS
    const ses = new aws.SES({ apiVersion: '2010-12-01' });

    // Create a Nodemailer transporter using SES
    const productionTransport = {
        SES: { ses, aws },
        sendingRate: 1 // max 1 messages/second
    } 
    
    // Use of actual environment configuration
    const activeTransport = process.env.NODE_ENV === 'development' ? developmentTransport : productionTransport
    const transport = nodemailer.createTransport(productionTransport)

    return transport
    */
} 