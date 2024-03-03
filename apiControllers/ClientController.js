import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs } from "firebase/firestore"

/**
 * @swagger
 * components:
 *   schemas:
 *     Clients:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - logo
 *       properties:
 *         id: 
 *           type: string
 *           description: The auto-generated id of the client
 *         name:
 *           type: string
 *           description: The name of the client
 *         logo:
 *           type: string
 *           description: The logo of the client
 *         createdAt: The day the client was added
 *       example:
 *         id: d5fe_Asz
 *         logo: /public/logo.png
 *         name: Fernando Jarilla 
 *         createdAt: 2024-03-03T09:43:06.157Z  
 */


class ClientController {

    /**
     * @swagger
     * /v1.0/clients:
     *   get:
     *     description: List all the clients
     *     responses:
     *       200:
     *         description: A list of clients
     */
    async getClients (req, res, next) {
        console.log('GET /v1.0/clients was called')
        const db = getFirestore(appFirebase)
        try {
            const clients = await getDocs(collection(db, "Clients"))
            clients.forEach( doc => {
                const data = doc.data()
                data.id = doc.id
                console.log(doc.id, " => ", doc.data())
                res.json(data)
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * /v1.0/clients:
     *   post:
     *     description: Create a new client
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Clients'
     *     responses:
     *       200:
     *         description: The created client
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Clients'
     */
    createClient (req, res, next) {
        console.log('POST /v1.0/clients was called')
        try {

        } catch (error) {
            next(error)
        }
    }

    updateClient (req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }

    deleteClient (req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }
}

export default ClientController