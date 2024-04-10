import { getUserByEmail } from "../lib/firebaseFunctions.js"
import { sendEmail } from "../lib/sendEmail.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"

class RecoverPasswordController {

    // Function to hash a password
    hashPassword = (plainPassword) => {
        return bcrypt.hash(plainPassword, 7)
    }

    recoverPassword = async (req, res, next) => {
        const email = req.query.email
        const link = req.query.link
        const client = await getUserByEmail(email)
        if (!client) {
            const error = new Error('Client not found')
            error.status = 404
            console.log('Error: ', error)
            return next(error)
        }
        const tokenJWT = await jwt.sign({ id: client.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        const from = 'miporra.info@gmail.com'
        const to = email
        const subject = 'Solicitud de reseteo de contraseña.'
        const html = `<p></p>Has solicitado restablecer tu contraseña. Por favor, haz click en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${link}?token=${tokenJWT}">Restablecer contraseña</a></p>`
        try {
           const result = await sendEmail(from, to, subject, html)
           res.json('Email enviado')
        } catch (error) {
            next(error)
        }
    }

    resetPassword = async (req, res, next) => {
        console.log(req.body)
        const clientId = req.body.clientId
        const password = req.body.password

        console.log('reset: ', clientId, password)
        const newPassword = await this.hashPassword(password)
        const clientToUpdate = {
            password: newPassword
        }
        const db = getFirestore(appFirebase);
        const clientRef = doc(db, 'Clients', clientId);
        await updateDoc(clientRef, clientToUpdate);
        res.json({ results: 'Password reseted'})
    }

}

export default RecoverPasswordController