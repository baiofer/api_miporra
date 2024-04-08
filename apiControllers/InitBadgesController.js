//import firebaseConfig from "../lib/firebaseConfig.js"
import { appFirebase } from "../app.js"
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, limit, writeBatch } from "firebase/firestore"
import { getStorage, ref, listAll, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../lib/resizeImage.js";


async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, limit(batchSize));
  
    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, q, batchSize, resolve, reject);
    });
}

async function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    const snapshot = await getDocs(query);
  
    if (snapshot.size == 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
  
    // Delete documents in a batch
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
  
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}


async function deleteFolderContents(path) {
    const storage = getStorage();
    const folderRef = ref(storage, path);
  
    const res = await listAll(folderRef);
  
    res.items.forEach((itemRef) => {
      deleteObject(itemRef);
    });
}

async function createBadge(team, appFirebase) {
    const db = getFirestore(appFirebase)
    const storage = getStorage()
    try {
        // Load badge image
        let badgeUrl = ''
        const filename = `${team}.png`
        const storageRef = ref(storage, `badges/${filename}`);
        const imageResized = await resizeImage(`badgesImages/${filename}`, true)
        const snapshot = await uploadBytes(storageRef, imageResized);
        badgeUrl = await getDownloadURL(snapshot.ref);

        // Create badge
        let teamName = ''
        switch (team) {
            case 'alaves':
                teamName = 'Alavés'
                break
            case 'almeria':
                teamName = 'Almeria'
                break
            case 'athletic':
                teamName = 'Athletic de Bilbao'
                break
            case 'atletico':
                teamName = 'Atletico de Madrid'
                break
            case 'barcelona':
                teamName = 'Barcelona'
                break
            case 'betis':
                teamName = 'Betis'
                break
            case 'cadiz':
                teamName = 'Cádiz'
                break
            case 'celta':
                teamName = 'Celta'
                break
            case 'getafe':
                teamName = 'Getafe'
                break
            case 'girona':
                teamName = 'Girona'
                break
            case 'granada':
                teamName = 'Granada'
                break
            case 'lasPalmas':
                teamName = 'Las Palmas'
                break
            case 'mallorca':
                teamName = 'Mallorca'
                break
            case 'osasuna':
                teamName = 'Osasuna'
                break
            case 'rayo':
                teamName = 'Rayo Vallecano'
                break
            case 'realMadrid':
                teamName = 'Real Madrid'
                 break
            case 'realSociedad':
                teamName = 'Real Sociedad'
                break
            case 'sevilla':
                teamName = 'Sevilla'
                break
            case 'valencia':
                teamName = 'Valencia'
                break
            case 'villareal':
                teamName = 'Villareal'
                break
            default:
                console.log('El nombre del equipo no es correcto')
        }
        const badgeToCreate = {
            name: teamName,
            badge: badgeUrl
        }
        const createdBadge = await addDoc(collection(db, 'Badges'), badgeToCreate)
    return createdBadge.id
    } catch (error) {
        console.log(error)
        console.log('An error occurred while creating the badge.')
    }
}


class InitBadgesController {

    /**
     * @swagger
     * tags:
     *   name: Badges
     *   description: Operations about badges
     * 
     * /v1.0/badges:
     *   get:
     *     tags: [Badges]
     *     summary: Don't require jwt. Give a badgets list
     *     description: Retrieve a list of badges from the Badges collection.
     *     parameters: 
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: name
     *         description: name to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A list of badges was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Badges'
     *       500:
     *         description: An error occurred while retrieving the badges.
     */

    getBadges = async (req, res, next) => {
        console.log('Toy aqui')
        const filterByName = req.query.name
        const filterById = req.query.id
        const db = getFirestore(appFirebase)
        console.log(filterByName, filterById)
        try {
            const listOfBadges = []
            // Filter by id
            if (filterById) {
                const docRef = doc(db, 'Badges', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfBadges.push(data);
                }
            // Filter by the rest of params
            } else {
                const badgesRef = collection(db, 'Badges');
                let q = query(badgesRef);
                if (filterByName) q = query(q, where("name", "==", filterByName));
                const badges = await getDocs(q);
                badges.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfBadges.push(data);
                })
            }
            res.json({ results: listOfBadges })
        } catch (error) {
            next(error)
        }
    }

    async initBadges() {
        // Init firebase
        const appFirebase = initializeApp(firebaseConfig)
        const db = getFirestore(appFirebase);

        // Init badges
        const badges = ["alaves", "almeria", "athletic", "atletico", "barcelona", "betis", "cadiz", "celta", "getafe", "girona", "lasPalmas", "mallorca", "osasuna", "rayo", "realMadrid", "realSociedad", "sevilla", "valencia", "villareal"]

        // Delete colecction Badges, and folder badges
        await deleteCollection(db, 'Badges', 100)
        await deleteFolderContents('/badges')

        try {
            badges.forEach( async (team) => {
                await createBadge(team, appFirebase)
            })
            console.log("The collection Badges is initialized.");
        } catch (error) {
            console.log(error)
        }
    }
}

export default InitBadgesController