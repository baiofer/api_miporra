//import nodemailer from 'nodemailer'
//import { SESClient } from '@aws-sdk/client-ses'

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
    
    // Production environment
    const productionTransport = {
        service: process.env.EMAIL_SERVICE_NAME,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASS
        }
    }
    
    // Configuration of AWS credentials
    const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
    
    // Use of actual environment configuration
    const transport = nodemailer.createTransport(productionTransport)

    return process.env.NODE_ENV === 'production' ? transport : sesClient
 */   
} 