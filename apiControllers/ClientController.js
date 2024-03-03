import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, setDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { unlink } from 'fs/promises'


class ClientController {

    /**
 * @swagger
 * /v1.0/clients:
 *   get:
 *     summary: Retrieve a list of clients
 *     description: Retrieve a list of clients from the Clients collection. The list can be used to populate a client management dashboard.
 *     responses:
 *       200:
 *         description: A list of clients was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clients'
 *       500:
 *         description: An error occurred while retrieving the clients.
 */
    async getClients (req, res, next) {
        const db = getFirestore(appFirebase)
        try {
            const listOfClients = []
            const clients = await getDocs(collection(db, "Clients"))
            clients.forEach( doc => {
                const data = doc.data()
                data.id = doc.id
                listOfClients.push(data)
            })
            res.json(listOfClients)
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * /v1.0/clients:
     *   post:
     *     summary: Create a new client
     *     description: Create a new client and save it to the Clients collection. The client's logo is uploaded to Firebase Storage and the download URL is saved to Firestore.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: The name of the client.
     *               email:
     *                 type: string
     *                 description: The email of the client.
     *               logo:
     *                 type: string
     *                 format: binary
     *                 description: The logo of the client.
     *     responses:
     *       200:
     *         description: The client was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Clients'
     *       500:
     *         description: An error occurred while creating the client.
     */
    async createClient(req, res, next) {
        const { name, email } = req.body
        const db = getFirestore(appFirebase)
        const storage = getStorage()
        try {
            // Upload file to firebase storage
            const storageRef = ref(storage, `logo/${req.file.filename}`)
            const snapshot = await uploadBytesResumable(storageRef, req.file)
            const logoUrl = await getDownloadURL(snapshot.ref)
            // Delete file from local storage
            await unlink(`uploads/${req.file.filename}`)
            // Create client in firestore
            const createdAt = new Date().toISOString()
            const clientToCreate = {
                name,
                email,
                logo: logoUrl,
                createdAt,
            }
            const createdClient = await addDoc(collection(db, 'Clients'), clientToCreate)
            // Add id to createdClient
            clientToCreate.id = createdClient.id
            // Return response
            res.json(clientToCreate);
        } catch (error) {
            next(error);
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