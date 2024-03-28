import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"


class ClubBetController {

    /**
     * @swagger
     * tags:
     *   name: ClubBet
     *   description: Operations about club bets
     * 
     * /v1.0/clubBetsJwt:
     *   get:
     *     tags: [ClubBet]
     *     summary: Retrieve a list of club bets
     *     description: Retrieve a list of club bets from the ClubBets collection. The list can be used to populate a club bet management dashboard.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: clubId
     *         description: ClubId to filter by.
     *         schema:
     *           type: string
     *       - in: query
     *         name: userEmail
     *         description: UserEmail to filter by.
     *         schema:
     *           type: string 
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: A list of club bets was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ClubBet'
     *       500:
     *         description: An error occurred while retrieving the club bet.
     */
    async getClubBetsJwt (req, res, next) {
        console.log('GetClubBets')
        const filterById = req.query.id
        const filterByClubId = req.query.clubId
        const filterByUserEmail = req.query.userEmail
        const db = getFirestore(appFirebase)
        try {
            const listOfClubBets = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'ClubBets', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfClubBets.push(data);
                }
            // Filter by the rest of params
            } else {
                const clubBetsRef = collection(db, 'ClubBets');
                let q = query(clubBetsRef);
                if (filterByClubId) q = query(q, where("clubId", "==", filterByClubId));
                if (filterByUserEmail) q = query(q, where("userEmail", "==", filterByUserEmail));
                const clubBets = await getDocs(q);
                clubBets.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfClubBets.push(data);
                })
            }
            // Add club data to clubBet data
            await Promise.all(listOfClubBets.map( async clubBet => {
                const clubBetRef = doc(db, 'Clubs', clubBet.clubId);
                const docSnap1 = await getDoc(clubBetRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clubBet.club = dataClient;
                }
                return clubBet
            }))
            // Add client data to clubBet data
            await Promise.all(listOfClubBets.map( async clubBet => {
                const clubRef = doc(db, 'Clients', clubBet.club.clientId);
                const docSnap1 = await getDoc(clubRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clubBet.client = dataClient;
                }
                return clubBet
            }))
            res.json({ results: listOfClubBets })
        } catch (error) {
            next(error)
        }
    }
    /**
     * @swagger
     * tags:
     *   name: ClubBet
     *   description: Operations about club bets
     * 
     * /v1.0/clubBets:
     *   get:
     *     tags: [ClubBet]
     *     summary: Retrieve a list of club bets
     *     description: Retrieve a list of club bets from the ClubBets collection. The list can be used to populate a club bet management dashboard.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: clubId
     *         description: ClubId to filter by.
     *         schema:
     *           type: string
     *       - in: query
     *         name: userEmail
     *         description: UserEmail to filter by.
     *         schema:
     *           type: string 
     *     responses:
     *       200:
     *         description: A list of club bets was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ClubBet'
     *       500:
     *         description: An error occurred while retrieving the club bet.
     */


    async getClubBets (req, res, next) {
        console.log('GetClubBets')
        const filterById = req.query.id
        const filterByClubId = req.query.clubId
        const filterByUserEmail = req.query.userEmail
        const db = getFirestore(appFirebase)
        try {
            const listOfClubBets = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'ClubBets', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfClubBets.push(data);
                }
            // Filter by the rest of params
            } else {
                const clubBetsRef = collection(db, 'ClubBets');
                let q = query(clubBetsRef);
                if (filterByClubId) q = query(q, where("clubId", "==", filterByClubId));
                if (filterByUserEmail) q = query(q, where("userEmail", "==", filterByUserEmail));
                const clubBets = await getDocs(q);
                clubBets.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfClubBets.push(data);
                })
            }
            // Add club data to clubBet data
            await Promise.all(listOfClubBets.map( async clubBet => {
                const clubBetRef = doc(db, 'Clubs', clubBet.clubId);
                const docSnap1 = await getDoc(clubBetRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clubBet.club = dataClient;
                }
                return clubBet
            }))
            // Add client data to clubBet data
            await Promise.all(listOfClubBets.map( async clubBet => {
                const clubRef = doc(db, 'Clients', clubBet.club.clientId);
                const docSnap1 = await getDoc(clubRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clubBet.client = dataClient;
                }
                return clubBet
            }))
            res.json({ results: listOfClubBets })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * tags:
     *   name: ClubBet
     *   description: Operations about club bets.
     * 
     * /v1.0/newClubBet:
     *   post:
     *     tags: [ClubBet]
     *     summary: Create a new club bet
     *     description: Create a new club bet and save it to the ClubBets collection.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               clubId:
     *                 type: string
     *                 description: The club where the user do the bet.
     *               userEmail:
     *                 type: string
     *                 description: The user email.
     *               userName:
     *                 type: string
     *                 description: The user name.
     *               match1HomeTeamResult:
     *                 type: number
     *                 description: Number of goals from home team in match 1.
     *               match1AwayTeamResult:
     *                 type: number
     *                 description: The number sof goals from away team in match 1.
     *               match2HomeTeamResult:
     *                 type: number
     *                 description: Number of goals from home team in match 2.
     *               match2AwayTeamResult:
     *                 type: number
     *                 description: The number sof goals from away team in match 2.
     *               betDate:
     *                 type: string
     *                 format: date
     *                 description: The date when the client do the bet.
     *               betPrice:
     *                 type: string
     *                 description: The price of the bet.
     *     responses:
     *       200:
     *         description: The club bet was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ClubBet'
     *       500:
     *         description: An error occurred while creating the club bet.
     */
    async createClubBet (req, res, next) {
        const { clubId, userEmail, userName, match1HomeTeamResult, match1AwayTeamResult, match2HomeTeamResult, match2AwayTeamResult, betDate, betPrice } = req.body
        const db = getFirestore(appFirebase)
        try {
            // Create club bet
            const createdAt = new Date().toISOString()
            const clubBetToCreate = {
                clubId, 
                userEmail, 
                userName, 
                match1HomeTeamResult,
                match1AwayTeamResult,
                match2HomeTeamResult,
                match2AwayTeamResult,
                betDate, 
                betPrice,  
                createdAt,
            }
            const createdClubBet = await addDoc(collection(db, 'ClubBets'), clubBetToCreate)
            // Add id to createdLottery
            clubBetToCreate.id = createdClubBet.id
            // Return response
            res.json({ results: clubBetToCreate });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the club bet.'})
        }
    }

    /**
     * @swagger
     * tags:
     *   name: ClubBet
     *   description: Operations about club bets.
     * 
     * /v1.0/updateClubBet/{id}:
     *   put:
     *     tags: [ClubBet]
     *     summary: Update an existing club bet.
     *     description: Update an existing club bet and save it to the Clubs collection.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The lottery bet id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               clubId:
     *                 type: string
     *                 description: The club where the user do the bet.
     *               userEmail:
     *                 type: string
     *                 description: The user email.
     *               userName:
     *                 type: string
     *                 description: The user name.
     *               match1HomeTeamResult:
     *                 type: number
     *                 description: Number of goals from home team in match 1.
     *               match11AwayTeamResult:
     *                 type: number
     *                 description: The number sof goals from away team in match 1.
     *               match2HomeTeamResult:
     *                 type: number
     *                 description: Number of goals from home team in match 2.
     *               match21AwayTeamResult:
     *                 type: number
     *                 description: The number sof goals from away team in match 2.
     *               betDate:
     *                 type: string
     *                 format: date
     *                 description: The date when the client do the bet.
     *               betPrice:
     *                 type: string
     *                 description: The price of the bet.
     *     responses:
     *       200:
     *         description: The club bet was updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ClubBet'
     *       404:
     *         description: The club bet was not found.
     *       500:
     *         description: An error occurred while updating the club bet.
     */
    async updateClubBet (req, res, next) {
        const { clubId, userEmail, userName, match1HomeTeamResult, match1AwayTeamResult, match2HomeTeamResult, match2AwayTeamResult, betDate, betPrice } = req.body
        const { id } = req.params;
        const db = getFirestore(appFirebase);
        try {
            const clubBetRef = doc(db, "ClubBets", id);
            const clubBetToUpdate = {};
            // Update data if exits
            if (clubId) clubBetToUpdate.clubId = clubId;
            if (userEmail) clubBetToUpdate.userEmail = userEmail;
            if (userName) clubBetToUpdate.userName = userName;
            if (match1HomeTeamResult) clubBetToUpdate.match1HomeTeamResult = match1HomeTeamResult;
            if (match1AwayTeamResult) clubBetToUpdate.match1AwayTeamResult = match1AwayTeamResult;
            if (match2HomeTeamResult) clubBetToUpdate.match2HomeTeamResult = match2HomeTeamResult;
            if (match2AwayTeamResult) clubBetToUpdate.match2AwayTeamResult = match2AwayTeamResult;
            if (betDate) clubBetToUpdate.betDate = betDate;
            if (betPrice) clubBetToUpdate.betPrice = betPrice;
            clubBetToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(clubBetRef, clubBetToUpdate);
            res.json({ results: { id, ...clubBetToUpdate } });
        } catch (error) {
            res.status(404).json({ error: `The club bet '${req.params.id}' was not found.`})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteClubBet/{id}:
     *   delete:
     *     tags: [ClubBet]
     *     summary: Delete a club bet.
     *     description: Delete a club bet from the ClubBets collection.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the club bet to delete.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: The club bet was deleted successfully.
     *       404:
     *         description: The club bet was not found.
     *       500:
     *         description: An error occurred while deleting the club bet.
     */
    async deleteClubBet (req, res, next) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`Not club bet delivery.`);
        }
        const db = getFirestore(appFirebase);
        try {
            const clubBetRef = doc(db, 'ClubBets', id);
            const clubBetSnap = await getDoc(clubBetRef);
            if (!clubBetSnap.exists()) {
                throw new Error(`The club bet '${id}' was not found.`);
            }
            await deleteDoc(clubBetRef);
            res.json({ message: `Club bet '${id}' was deleted successfully.` });
        } catch (error) {
            res.status(404).json({ error: error.message})
        }
    }
}

export default ClubBetController