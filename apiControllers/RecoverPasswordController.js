import { appFirebase } from "../app.js"
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendMail } from "../lib/sendEmail.js"

class RecoverPasswordController {


    recoverPassword = async (req, res, next) => {
        console.log('Envio un correo')
        try {
            sendMail('fjarilla64@gmail.com', 'Prueba de email', 'Este es el texto del email')
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default RecoverPasswordController