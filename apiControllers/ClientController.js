import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { unlink } from 'fs/promises'
import fs from 'fs'
import { resizeImage } from "../lib/resizeImage.js"
import bcrypt from 'bcrypt'
import { deleteClubs } from "../lib/firebaseFunctions.js"



class ClientController {

    // Function to hash a password
    hashPassword = (plainPassword) => {
        return bcrypt.hash(plainPassword, 7)
    }

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Operations about clients
 * 
 * /v1.0/clientsJwt:
 *   get:
 *     tags: [Clients]
 *     summary: Require jwt. Give the client data in the token
 *     description: Retrieve the client introduced in the jwt from the Clients collection.
 *     security:
 *       - JWTAuth: [] 
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
    async getClientsJwt (req, res, next) {
        const filterById = req.userLoggedApi
        const db = getFirestore(appFirebase)
        try {
            const listOfClients = []
            const docRef = doc(db, 'Clients', filterById);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                data.id = docSnap.id;
                listOfClients.push(data);
            }
            res.json({ results: listOfClients })
        } catch (error) {
            next(error)
        }
    }


/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Operations about clients
 * 
 * /v1.0/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Don't require jwt. Give a client list
 *     description: Retrieve a list of clients from the Clients collection.
 *     parameters: 
 *       - in: query
 *         name: id
 *         description: ID to filter by. Using this parameter, overrides the others.
 *         schema:
 *           type: string 
 *       - in: query
 *         name: email
 *         description: email to filter by. Using this parameter, overrides the others.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         description: name to filter by. Using this parameter, overrides the others.
 *         schema:
 *           type: string
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
        // The clientId comes in req.userLoggedApi
        const filterByName = req.query.name
        const filterByEmail = req.query.email
        const filterById = req.query.id
        const db = getFirestore(appFirebase)
        try {
            const listOfClients = []
            // Filter by id
            if (filterById) {
                const docRef = doc(db, 'Clients', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfClients.push(data);
                }
            // Filter by the rest of params
            } else {
                const clientsRef = collection(db, 'Clients');
                let q = query(clientsRef);
                if (filterByEmail) q = query(q, where("email", "==", filterByEmail));
                if (filterByName) q = query(q, where("name", "==", filterByName));
                const clients = await getDocs(q);
                clients.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfClients.push(data);
                })
            }
            res.json({ results: listOfClients })
        } catch (error) {
            next(error)
        }
    }

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Operations about clients
 * 
 * /v1.0/newClient:
 *   post:
 *     tags: [Clients]
 *     summary: Don't require jwt. Create a new client
 *     description: Create a new client and save it to the Clients collection. The client's logo is uploaded to Firebase Storage and the download URL is saved to Firestore. Not jwt required.
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
 *               password:
 *                 type: string
 *                 description: The password of the client. 
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
    createClient = async (req, res, next) => {
        const { name, email, password } = req.body
        const db = getFirestore(appFirebase)
        const storage = getStorage()
        try {
            // Test if the email exists in BD
            let client = ""
            const clientsRef = collection(db, 'Clients')
            const q = query(clientsRef, where("email", "==", email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                client = doc.data();
            });
            if (client.length !== 0) {
                res.status(409).json({ error: 'A client with this email already exists.' })
                return
            }
            //Get file and store it if exits
            let logoUrl = ''
            if (req.file) {
                const storageRef = ref(storage, `logo/${req.file.filename}`);
                const imageResized = await resizeImage(`uploads/${req.file.filename}`)
                const snapshot = await uploadBytes(storageRef, imageResized);
                logoUrl = await getDownloadURL(snapshot.ref);
                await unlink(`uploads/${req.file.filename}`);
            } 
            const newPassword = await this.hashPassword(password)
            // Create client
            const createdAt = new Date().toISOString()
            const clientToCreate = {
                name,
                email,
                password: newPassword,
                logo: logoUrl,
                createdAt,
            }
            const createdClient = await addDoc(collection(db, 'Clients'), clientToCreate)
            // Add id to createdClient
            clientToCreate.id = createdClient.id
            clientToCreate.password = "????"
            // Return response
            res.json({ results: clientToCreate });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the client.'})
        }
    }

/**
 * @swagger
 * /v1.0/updateClient:
 *   put:
 *     tags: [Clients]
 *     summary: Require jwt. Update a client
 *     description: Update the client in the JWT.
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
 *               password:
 *                 type: string
 *                 description: The password of the client.
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: The client was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clients'
 *       400:
 *         description: The request was invalid.
 *       404:
 *         description: The client was not found.
 *       500:
 *         description: An error occurred while updating the client.
 */
    updateClient = async (req, res, next) => {
        const { name, email, password } = req.body;
        // The clientId comes in req.userLoggedApi
        const id = req.userLoggedApi;
        const db = getFirestore(appFirebase);
        const storage = getStorage();
        try {
            const clientRef = doc(db, 'Clients', id);
            // get the client register
            const client = await (await getDoc(clientRef)).data()
            const clientToUpdate = {};
            // Update data if exits
            if (name) clientToUpdate.name = name;
            if (email) {
                res.status(403).json({ error: 'Modification of the email field is not allowed.' })
                return
            }
            if (password) {
                const newPassword = await this.hashPassword(password)
                clientToUpdate.password = newPassword;
            }
            if (req.file) {
                // Get the actual logo path
                const previousLogoUrl = client.logo
                // Get the image
                const storageRef = ref(storage, `logo/${req.file.filename}`);
                const imageData = fs.readFileSync(`uploads/${req.file.filename}`)
                const snapshot = await uploadBytes(storageRef, imageData);
                const logoUrl = await getDownloadURL(snapshot.ref);
                clientToUpdate.logo = logoUrl;
                await unlink(`uploads/${req.file.filename}`);
                // Delete previous image in storage
                const decodedUrl = decodeURIComponent(previousLogoUrl);
                const logoPath = decodedUrl.split(/\/o\/(.+)\?/)[1];
                const logoRef = ref(storage, `${logoPath}`);
                await deleteObject(logoRef);
            }
            // Update client
            clientToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(clientRef, clientToUpdate);
            clientToUpdate.password = "????"
            res.json({ results: { id, ...clientToUpdate } });
        } catch (error) {
            res.status(404).json({ error: `The client '${req.params.id}' was not found.`})
        }
    }

/**
 * @swagger
 * /v1.0/deleteClient:
 *   delete:
 *     tags: [Clients]
 *     summary: Require jwt. Delete the client in the JWT.
 *     description: Delete the client given in the JWT with all his clubs and club bets.
 *     security:
 *       - JWTAuth: []
 *     responses:
 *       200:
 *         description: The client was deleted successfully.
 *       404:
 *         description: The client was not found.
 *       500:
 *         description: An error occurred while deleting the client.
 */
    async deleteClient (req, res, next) {
        // The clientId comes in req.userLoggedApi
        const id = req.userLoggedApi;
        const db = getFirestore(appFirebase);
        const storage = getStorage();
        try {
            // Delete Clubs and club bets
            deleteClubs(id)
            // Delete client
            const clientRef = doc(db, 'Clients', id);
            const clientSnap = await getDoc(clientRef);
            if (!clientSnap.exists()) {
                throw new Error(`The client '${id}' was not found.`);
            }
            const clientData = clientSnap.data();
            const logoUrl = clientData.logo;
            const decodedUrl = decodeURIComponent(logoUrl);
            const logoPath = decodedUrl.split(/\/o\/(.+)\?/)[1];
            const logoRef = ref(storage, `${logoPath}`);
            await deleteClubs(id)
            await deleteDoc(clientRef);
            await deleteObject(logoRef);
            res.json({ message: `Client '${id}' was deleted successfully.` });
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                res.json({ message: `Client '${id}' was deleted successfully!.` });
            } else {
                res.status(404).json({ error: error.message})
            }
        }
    }
}

export default ClientController