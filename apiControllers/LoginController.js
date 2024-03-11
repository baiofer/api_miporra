import { appFirebase } from "../app.js"
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class LoginController {

    // Function to check a password
    comparePassword = (plainPassword, clientPassword) => {
        return bcrypt.compare(plainPassword, clientPassword)
    }

/**
     * @swagger
     * tags:
     *   name: Clients
     *   description: Operations about clients
     * 
     * /v1.0/login:
     *   post:
     *     tags: [Clients]
     *     summary: Create a new client
     *     description: Create a new client and save it to the Clients collection. The client's logo is uploaded to Firebase Storage and the download URL is saved to Firestore.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 description: The email of the client.
     *               password:
     *                 type: string
     *                 description: The password of the client. 
     *     responses:
     *       200:
     *         description: The client was logged successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   format: jwt
     *                 expiresIn:
     *                   type: integer
     *                   description: Time in seconds until expiration
     *       401:
     *         description: Unauthorized. Invalid credentials
     *       500:
     *         description: An error occurred while creating the client.
     */
    login = async (req, res, next) => {
        const { email, password } = req.body
        const db = getFirestore(appFirebase)
        try {
            let client = ""
            const clientsRef = collection(db, 'Clients')
            const q = query(clientsRef, where("email", "==", email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                client = doc.data();
            });
            if (client.length === 0 || !await this.comparePassword(password, client.password)) {
                res.status(401).json({ error: 'Invalid credentials.' })
            } else {
                res.json({ results: "OK" })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    jwtLogin = async (req, res, next) => {
        const { email, password } = req.body
        const db = getFirestore(appFirebase)
        try {
            let client = ""
            const clientsRef = collection(db, 'Clients')
            const q = query(clientsRef, where("email", "==", email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                client = doc.data();
            });
            if (client.length === 0 || !await this.comparePassword(password, client.password)) {
                res.status(401).json({ error: 'Invalid credentials.' })
            } else {
                const tokenJWT = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '2d'
                })
                res.json({ jwt: tokenJWT})
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

export default LoginController