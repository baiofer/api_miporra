import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs } from "firebase/firestore"

class ClientController {

    async getClients (req, res, next) {
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

    createClient (req, res, next) {
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