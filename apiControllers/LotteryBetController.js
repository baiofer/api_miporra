import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"


class LotteryBetController {

    /**
     * @swagger
     * tags:
     *   name: LotteryBetsJwt
     *   description: Operations about Lottery bets
     * 
     * /v1.0/lotteryBets:
     *   get:
     *     tags: [LotteryBet]
     *     summary: Retrieve a list of lottery bets
     *     description: Retrieve a list of lottery bets from the LotteryBets collection. The list can be used to populate a lottery bet management dashboard.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: LotteryId
     *         description: LotteryId to filter by.
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
     *         description: A list of lottery bets was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/LotteryBet'
     *       500:
     *         description: An error occurred while retrieving the lottery bet.
     */
    async getLotteryBetsJwt (req, res, next) {
        const filterById = req.query.id
        const filterByLotteryId = req.query.lotteryId
        const filterByUserEmail = req.query.userEmail
        const db = getFirestore(appFirebase)
        try {
            const listOfLotteryBets = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'LotteryBets', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfLotteryBets.push(data);
                }
            // Filter by the rest of params
            } else {
                const lotteryBetsRef = collection(db, 'LotteryBets');
                let q = query(lotteryBetsRef);
                if (filterByLotteryId) q = query(q, where("clubId", "==", filterByLotteryId));
                if (filterByUserEmail) q = query(q, where("userEmail", "==", filterByUserEmail));
                const lotteryBets = await getDocs(q);
                lotteryBets.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfLotteryBets.push(data);
                })
            }
            res.json({ results: listOfLotteryBets })
        } catch (error) {
            next(error)
        }
    }
    /**
     * @swagger
     * tags:
     *   name: LotteryBets
     *   description: Operations about Lottery bets
     * 
     * /v1.0/lotteryBets:
     *   get:
     *     tags: [LotteryBet]
     *     summary: Retrieve a list of lottery bets
     *     description: Retrieve a list of lottery bets from the LotteryBets collection. The list can be used to populate a lottery bet management dashboard.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: LotteryId
     *         description: LotteryId to filter by.
     *         schema:
     *           type: string
     *       - in: query
     *         name: userEmail
     *         description: UserEmail to filter by.
     *         schema:
     *           type: string 
     *     responses:
     *       200:
     *         description: A list of lottery bets was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/LotteryBet'
     *       500:
     *         description: An error occurred while retrieving the lottery bet.
     */
    async getLotteryBets (req, res, next) {
        const filterById = req.query.id
        const filterByLotteryId = req.query.lotteryId
        const filterByUserEmail = req.query.userEmail
        const db = getFirestore(appFirebase)
        try {
            const listOfLotteryBets = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'LotteryBets', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfLotteryBets.push(data);
                }
            // Filter by the rest of params
            } else {
                const lotteryBetsRef = collection(db, 'LotteryBets');
                let q = query(lotteryBetsRef);
                if (filterByLotteryId) q = query(q, where("clubId", "==", filterByLotteryId));
                if (filterByUserEmail) q = query(q, where("userEmail", "==", filterByUserEmail));
                const lotteryBets = await getDocs(q);
                lotteryBets.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfLotteryBets.push(data);
                })
            }
            res.json({ results: listOfLotteryBets })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * tags:
     *   name: LotteryBet
     *   description: Operations about lottery bets.
     * 
     * /v1.0/newLotteryBet:
     *   post:
     *     tags: [LotteryBet]
     *     summary: Create a new lottery bet
     *     description: Create a new lottery bet and save it to the LotteryBets collection.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               lotteryId:
     *                 type: string
     *                 description: The lottery where the user do the bet.
     *               userEmail:
     *                 type: string
     *                 description: The user email.
     *               userName:
     *                 type: string
     *                 description: The user name.
     *               selectedNumber:
     *                 type: number
     *                 description: The number selected as bet.
     *               betDate:
     *                 type: string
     *                 format: date
     *                 description: The date when the client do the bet.
     *               betPrice:
     *                 type: string
     *                 description: The price of the bet.
     *     responses:
     *       200:
     *         description: The lottery bet was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LotteryBet'
     *       500:
     *         description: An error occurred while creating the lottery bet.
     */
    async createLotteryBet (req, res, next) {
        const { lotteryId, userEmail, userName, selectedNumber, betDate, betPrice } = req.body
        const db = getFirestore(appFirebase)
        try {
            // Create club
            const createdAt = new Date().toISOString()
            const lotteryBetToCreate = {
                lotteryId, 
                userEmail, 
                userName, 
                selectedNumber, 
                betDate, 
                betPrice,  
                createdAt,
            }
            const createdLotteryBet = await addDoc(collection(db, 'LotteryBets'), lotteryBetToCreate)
            // Add id to createdLottery
            lotteryBetToCreate.id = createdLotteryBet.id
            // Return response
            res.json({ results: lotteryBetToCreate });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while creating the lottery bet.'})
        }
    }

    /**
     * @swagger
     * tags:
     *   name: LotteryBet
     *   description: Operations about lottery bets.
     * 
     * /v1.0/updateLotteryBet/{id}:
     *   put:
     *     tags: [LotteryBet]
     *     summary: Update an existing lottery bet.
     *     description: Update an existing lottery bet and save it to the Lotteries collection.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The lottery bet id
     *     requestBody:
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               lotteryId:
     *                 type: string
     *                 description: The lottery where the user do the bet.
     *               userEmail:
     *                 type: string
     *                 description: The user email.
     *               userName:
     *                 type: string
     *                 description: The user name.
     *               selectedNumber:
     *                 type: number
     *                 description: The number selected as bet.
     *               betDate:
     *                 type: string
     *                 format: date
     *                 description: The date when the client do the bet.
     *               betPrice:
     *                 type: string
     *                 description: The price of the bet.
     *     responses:
     *       200:
     *         description: The lottery bet was updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/LotteryBet'
     *       404:
     *         description: The lottery bet was not found.
     *       500:
     *         description: An error occurred while updating the lottery bet.
     */
    async updateLotteryBet (req, res, next) {
        console.log('LOTTERY BET')
        const { lotteryId, userEmail, userName, selectedNumber, betDate, betPrice, howToWin } = req.body
        const { id } = req.params;
        const db = getFirestore(appFirebase);
        try {
            const lotteryBetRef = doc(db, 'LotteryBets', id);
            const lotteryBetToUpdate = {};
            // Update data if exits
            if (lotteryId) lotteryBetToUpdate.lotteryId = lotteryId;
            if (userEmail) lotteryBetToUpdate.userEmail = userEmail;
            if (userName) lotteryBetToUpdate.userName = userName;
            if (selectedNumber) lotteryBetToUpdate.selectedNumber = selectedNumber;
            if (betDate) lotteryBetToUpdate.betDate = betDate;
            if (betPrice) lotteryBetToUpdate.betPrice = betPrice;
            if (howToWin) lotteryBetToUpdate.howToWin = howToWin;
            lotteryBetToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(lotteryBetRef, lotteryBetToUpdate);
            res.json({ results: { id, ...lotteryBetToUpdate } });
        } catch (error) {
            console.log(error)
            res.status(404).json({ error: `The lottery bet '${req.params.id}' was not found.`})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteLotteryBet/{id}:
     *   delete:
     *     tags: [LotteryBet]
     *     summary: Delete a lottery bet.
     *     description: Delete a lottery bet from the Lotteries collection.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the lottery bet to delete.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: The lottery bet was deleted successfully.
     *       404:
     *         description: The lottery bet was not found.
     *       500:
     *         description: An error occurred while deleting the lottery bet.
     */
    async deleteLotteryBet (req, res, next) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`Not lottery bet delivery.`);
        }
        const db = getFirestore(appFirebase);
        try {
            const lotteryBetRef = doc(db, 'LotteryBets', id);
            const lotteryBetSnap = await getDoc(lotteryBetRef);
            if (!lotteryBetSnap.exists()) {
                throw new Error(`The lottery bet '${id}' was not found.`);
            }
            await deleteDoc(lotteryBetRef);
            res.json({ message: `Lottery bet '${id}' was deleted successfully.` });
        } catch (error) {
            res.status(404).json({ error: error.message})
        }
    }
}

export default LotteryBetController