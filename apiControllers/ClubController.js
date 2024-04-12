import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"
import { deleteClubBets } from "../lib/firebaseFunctions.js"


class ClubController {

        /**
     * @swagger
     * tags:
     *   name: Club
     *   description: Operations about clubs
     * 
     * /v1.0/clubs:
     *   get:
     *     tags: [Club]
     *     summary: Retrieve a list of clubs
     *     description: Retrieve a list of clubs from the Clubs collection. The list containts all the clubs.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: clientId
     *         description: ClientId to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: state
     *         description: State to filter by.
     *         schema:
     *           type: string
     *           enum: [in progress, finished]  
     *     responses:
     *       200:
     *         description: A list of clubs was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Club'
     *       500:
     *         description: An error occurred while retrieving the clubs.
     */
        async getClubs (req, res, next) {
            const filterById = req.query.id
            const filterByClientId = req.query.clientId
            const filterByState = req.query.state
            const db = getFirestore(appFirebase)
            try {
                const listOfClubs = []
                // Filter by Id
                if (filterById) {
                    const docRef = doc(db, 'Clubs', filterById);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        data.id = docSnap.id;
                        listOfClubs.push(data);
                    }
                // Filter by the rest of params
                } else {
                    const clubsRef = collection(db, 'Clubs');
                    let q = query(clubsRef);
                    if (filterByClientId) q = query(q, where("clientId", "==", filterByClientId));
                    if (filterByState) q = query(q, where("state", "==", filterByState));
                    const clubs = await getDocs(q);
                    clubs.forEach(doc => {
                        const data = doc.data();
                        data.id = doc.id;
                        listOfClubs.push(data);
                    })
                }
                // Add client data to club data
                await Promise.all(listOfClubs.map( async clientClub => {
                    const clubRef = doc(db, 'Clients', clientClub.clientId);
                    const docSnap1 = await getDoc(clubRef);
                    if (docSnap1.exists()) {
                        const dataClient = docSnap1.data();
                        clientClub.client = dataClient;
                    }
                    return clientClub
                }))
                res.json({ results: listOfClubs })
            } catch (error) {
                console.log(error)
                next(error)
            }
        }


    /**
     * @swagger
     * tags:
     *   name: Club
     *   description: Operations about clubs
     * 
     * /v1.0/clubsJwt:
     *   get:
     *     tags: [Club]
     *     summary: Retrieve the list of clubs of the jwt owner.
     *     description: Retrieve a list of clubs from the Clubs collection. The list contains the clubs edited by the owner of the JWT.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: state
     *         description: State to filter by.
     *         schema:
     *           type: string
     *           enum: [in progress, finished]
     *     security:
     *       - JWTAuth: []  
     *     responses:
     *       200:
     *         description: A list of clubs was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Club'
     *       500:
     *         description: An error occurred while retrieving the clubs.
     */
    async getClubsJWT (req, res, next) {
        const filterById = req.query.id
        // The clientId comes in req.userLoggedApi
        const filterByClientId = req.userLoggedApi
        const filterByState = req.query.state
        const db = getFirestore(appFirebase)
        try {
            const listOfClubs = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'Clubs', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfClubs.push(data);
                }
            // Filter by the rest of params
            } else {
                const clubsRef = collection(db, 'Clubs');
                let q = query(clubsRef);
                if (filterByClientId) q = query(q, where("clientId", "==", filterByClientId));
                if (filterByState) q = query(q, where("state", "==", filterByState));
                const clubs = await getDocs(q);
                clubs.forEach(async club => {
                    const data = club.data();
                    data.id = club.id;
                    listOfClubs.push(data);
                })
            }
            // Add client data to club data
            await Promise.all(listOfClubs.map( async clientClub => {
                const clubRef = doc(db, 'Clients', clientClub.clientId);
                const docSnap1 = await getDoc(clubRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clientClub.client = dataClient;
                }
                return clientClub
            }))
            res.json({ results: listOfClubs })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * tags:
     *   name: Club
     *   description: Operations about clubs
     * 
     * /v1.0/newClub:
     *   post:
     *     tags: [Club]
     *     summary: Create a new club
     *     description: Create a new club and save it to the Clubs collection. The ownwer of the club is the owner of the token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               match1HomeTeam:
     *                 type: string
     *                 description: The home team of the first match.
     *               match1AwayTeam:
     *                 type: string
     *                 description: The away team of the first match.
     *               match1Date:
     *                 type: string
     *                 format: date
     *                 description: The date of the first match.
     *               match1Hour:
     *                 type: string
     *                 description: The hour of the first match.
     *               match2HomeTeam:
     *                 type: string
     *                 description: The home team of the second match.
     *               match2AwayTeam:
     *                 type: string
     *                 description: The away team of the second match.
     *               match2Date:
     *                 type: string
     *                 format: date
     *                 description: The date of the second match.
     *               match2hour:
     *                 type: string
     *                 description: The hour of the second match.
     *               betPrice:
     *                 type: number
     *                 description: The price of the bet.
     *               accumulatedPrize:
     *                 type: number
     *                 description: The accumulated prize.
     *               accumulatedJackpot:
     *                 type: number
     *                 description: The accumulated jackpot.
     *               limitDateForBets:
     *                 type: string
     *                 format: date
     *                 description: The limit date for bets.
     *               limitHourForBets:
     *                 type: string
     *                 description: The limit hour for bets.
     *               state:
     *                 type: string
     *                 enum: [in progress, finished]
     *                 description: The state of the club (inProgrss / finished).
     *               numberOfWinners:
     *                 type: number
     *                 description: The number of winners.
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The club was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Club'
     *       500:
     *         description: An error occurred while creating the club.
     */
    async createClub (req, res, next) {
        const { match1HomeTeam, match1AwayTeam, match1Date, match1Hour, match2HomeTeam, match2AwayTeam, match2Date, match2hour, betPrice, accumulatedPrize, accumulatedJackpot, limitDateForBets, limitHourForBets, state, numberOfWinners } = req.body
        // The clientId comes in req.userLoggedApi
        const clientId = req.userLoggedApi
        const db = getFirestore(appFirebase)
        try {
            // Create club
            const createdAt = new Date().toISOString()
            const clubToCreate = {
                clientId,
                match1HomeTeam, 
                match1AwayTeam, 
                match1Date, 
                match1Hour, 
                match2HomeTeam, 
                match2AwayTeam, 
                match2Date, 
                match2hour, 
                betPrice, 
                accumulatedPrize, 
                accumulatedJackpot, 
                limitDateForBets,
                limitHourForBets, 
                state, 
                numberOfWinners,
                createdAt,
            }
            const createdClub = await addDoc(collection(db, 'Clubs'), clubToCreate)
            // Add id to createdClient
            clubToCreate.id = createdClub.id
            // Return response
            res.json({ results: clubToCreate });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the club.'})
        }
    }

    /**
     * @swagger
     * tags:
     *   name: Club
     *   description: Operations about clubs
     * 
     * /v1.0/updateClub/{id}:
     *   put:
     *     tags: [Club]
     *     summary: Update an existing club
     *     description: Update an existing club and save it to the Clubs collection. The club owner must be the owner of the token.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The club id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               match1HomeTeam:
     *                 type: string
     *                 description: The home team of the first match.
     *               match1AwayTeam:
     *                 type: string
     *                 description: The away team of the first match.
     *               match1Date:
     *                 type: string
     *                 format: date
     *                 description: The date of the first match.
     *               match1Hour:
     *                 type: string
     *                 description: The hour of the first match.
     *               match2HomeTeam:
     *                 type: string
     *                 description: The home team of the second match.
     *               match2AwayTeam:
     *                 type: string
     *                 description: The away team of the second match.
     *               match2Date:
     *                 type: string
     *                 format: date
     *                 description: The date of the second match.
     *               match2hour:
     *                 type: string
     *                 description: The hour of the second match.
     *               betPrice:
     *                 type: number
     *                 description: The price of the bet.
     *               accumulatedPrize:
     *                 type: number
     *                 description: The accumulated prize.
     *               accumulatedJackpot:
     *                 type: number
     *                 description: The accumulated jackpot.
     *               limitDateForBets:
     *                 type: string
     *                 format: date
     *                 description: The limit date for bets.
     *               limitHourForBets:
     *                 type: string
     *                 description: The limit hour for bets.
     *               state:
     *                 type: boolean
     *                 description: The state of the club (inProgress / finished).
     *               numberOfWinners:
     *                 type: number
     *                 description: The number of winners.
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The club was updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Club'
     *       404:
     *         description: The club was not found.
     *       500:
     *         description: An error occurred while updating the club.
     */
    async updateClub (req, res, next) {
        const { match1HomeTeam, match1AwayTeam, match1Date, match1Hour, match2HomeTeam, match2AwayTeam, match2Date, match2hour, betPrice, accumulatedPrize, accumulatedJackpot, limitDateForBets, limitHourForBets, state, numberOfWinners } = req.body
        const { id } = req.params;
        // The clientId comes in req.userLoggedApi
        const clientId = req.userLoggedApi
        const db = getFirestore(appFirebase);
        try {
            const clubRef = doc(db, 'Clubs', id);
            const docSnap = await getDoc(clubRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.clientId !== clientId) {
                    res.status(404).json({ error: `The club '${id}' is not property of the token owner. We can't uptate it.`})
                    return
                }
            } else {
                throw new Error(`The club '${id}' was not found.`);
            }
            const clubToUpdate = {};
            // Update data if exits
            if (clientId) clubToUpdate.clientId = clientId;
            if (match1HomeTeam) clubToUpdate.match1HomeTeam = match1HomeTeam;
            if (match1AwayTeam) clubToUpdate.match1AwayTeam = match1AwayTeam;
            if (match1Date) clubToUpdate.match1Date = match1Date;
            if (match1Hour) clubToUpdate.match1Hour = match1Hour;
            if (match2HomeTeam) clubToUpdate.match2HomeTeam = match2HomeTeam;
            if (match2AwayTeam) clubToUpdate.match2AwayTeam = match2AwayTeam;
            if (match2Date) clubToUpdate.match2Date = match2Date;
            if (match2hour) clubToUpdate.match2hour = match2hour;
            if (betPrice) clubToUpdate.betPrice = betPrice;
            if (accumulatedPrize) clubToUpdate.accumulatedPrize = accumulatedPrize;
            if (accumulatedJackpot) clubToUpdate.accumulatedJackpot = accumulatedJackpot;
            if (limitDateForBets) clubToUpdate.limitDateForBets = limitDateForBets;
            if (limitHourForBets) clubToUpdate.limitHourForBets = limitHourForBets;
            if (state) clubToUpdate.state = state;
            if (numberOfWinners) clubToUpdate.numberOfWinners = numberOfWinners;
            clubToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(clubRef, clubToUpdate);
            res.json({ results: { id, ...clubToUpdate } });
        } catch (error) {
            res.status(404).json({ error: `The club '${req.params.id}' was not found.`})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteClub/{id}:
     *   delete:
     *     tags: [Club]
     *     summary: Delete a club
     *     description: Delete a club from the Clubs collection and all his bets. The club owner must be the owner of the token.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the club to delete.
     *         schema:
     *           type: string
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The club was deleted successfully.
     *       404:
     *         description: The club was not found.
     *       500:
     *         description: An error occurred while deleting the club.
     */
    async deleteClub (req, res, next) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`Not club delivery.`);
        }
        const db = getFirestore(appFirebase);
        try {
            const clubRef = doc(db, 'Clubs', id);
            const clubSnap = await getDoc(clubRef);
            if (!clubSnap.exists()) {
                throw new Error(`The club '${id}' was not found.`);
            }
            const data = clubSnap.data();
            if (data.clientId !== req.userLoggedApi) {
                res.status(404).json({ error: `The club '${id}' is not property of the token owner. We can't delete it.`})
                return
            }
            await deleteClubBets(id)
            await deleteDoc(clubRef);
            res.json({ message: `Club '${id}' was deleted successfully.` });
        } catch (error) {
            res.status(404).json({ error: error.message})
        }
    }
}

export default ClubController