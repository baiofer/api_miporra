import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, deleteDoc, query, where } from "firebase/firestore"
import { sendEmail } from "../lib/sendEmail.js";


class SendEmailController {

    /**
     * @swagger
     * tags:
     *   name: SendMail
     *   description: Other operations
     * 
     * /v1.0/sendEmail:
     *   post:
     *     tags: [SendMail]
     *     summary: Send an email
     *     description: Send an email
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               from:
     *                 type: string
     *                 description: The sender of the email.
     *               to:
     *                 type: string
     *                 description: The receiver of the email.
     *               subject:
     *                 type: string
     *                 description: The subject of the email.
     *               html:
     *                 type: string
     *                 description: The body of the email.
     *     responses:
     *       200:
     *         description: The email was sent.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Others'
     *       500:
     *         description: An error occurred while sending the email.
     */
    async sendEmail (req, res, next) {
        const { from, to, subject, html } = req.body
        try {
            sendEmail(from, to, subject, html)
            res.json({ results: 'Email sent' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while sending the email.'})
        }
    }
}

export default SendEmailController