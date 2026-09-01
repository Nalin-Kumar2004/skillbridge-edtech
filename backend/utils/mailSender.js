const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

// Create SES client using the same S3 IAM credentials
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const mailSender = async (email, title, body) => {
    try {
        const params = {
            Destination: {
                ToAddresses: [email], // Send to this email
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: body,
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: title,
                },
            },
            Source: process.env.AWS_SES_FROM_EMAIL, // Must be verified in AWS SES Console
        };

        const command = new SendEmailCommand(params);
        const info = await sesClient.send(command);
        
        // console.log('Info of sent mail - ', info);
        return info;
    }
    catch (error) {
        console.error('Error while sending mail via SES - ', email);
        console.error(error);
        throw error;
    }
}

module.exports = mailSender;