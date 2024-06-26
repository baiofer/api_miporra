import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"
import { deleteLotteryBets } from "../lib/firebaseFunctions.js"


class LotteryController {

    /**
     * @swagger
     * tags:
     *   name: Lottery
     *   description: Operations about Lotteries
     * 
     * /v1.0/lotteries:
     *   get:
     *     tags: [Lottery]
     *     summary: Retrieve a list of lotteries
     *     description: Retrieve a list of lotteries from the Lotteries collection.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: clientId
     *         description: ClientId to filter by.
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
     *         description: A list of lotteries was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Lottery'
     *       500:
     *         description: An error occurred while retrieving the lottery.
     */
    async getLotteries (req, res, next) {
        const filterById = req.query.id
        const filterByClientId = req.query.clientId
        const filterByState = req.query.state
        const db = getFirestore(appFirebase)
        try {
            const listOfLotteries = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'Lotteries', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfLotteries.push(data);
                }
            // Filter by the rest of params
            } else {
                const lotteriesRef = collection(db, 'Lotteries');
                let q = query(lotteriesRef);
                if (filterByClientId) q = query(q, where("clientId", "==", filterByClientId));
                if (filterByState) q = query(q, where("state", "==", filterByState));
                const lotteries = await getDocs(q);
                lotteries.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfLotteries.push(data);
                })
            }
            // Add client data to club data
            await Promise.all(listOfLotteries.map( async clientLottery => {
                const lotteryRef = doc(db, 'Clients', clientLottery.clientId);
                const docSnap1 = await getDoc(lotteryRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clientLottery.client = dataClient;
                }
                return clientLottery
            }))
            res.json({ results: listOfLotteries })
        } catch (error) {
            next(error)
        }
    }


    /**
     * @swagger
     * tags:
     *   name: Lottery
     *   description: Operations about Lotteries
     * 
     * /v1.0/lotteriesJwt:
     *   get:
     *     tags: [Lottery]
     *     summary: Retrieve the list of lotteries of the JWT owner.
     *     description: Retrieve the list of lotteries of the JWT owner.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: clientId
     *         description: ClientId to filter by.
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
     *         description: A list of lotteries was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Lottery'
     *       500:
     *         description: An error occurred while retrieving the lottery.
     */
    async getLotteriesJwt (req, res, next) {
        const filterById = req.query.id
        const filterByClientId = req.userLoggedApi
        const filterByState = req.query.state
        const db = getFirestore(appFirebase)
        try {
            const listOfLotteries = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'Lotteries', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfLotteries.push(data);
                }
            // Filter by the rest of params
            } else {
                const lotteriesRef = collection(db, 'Lotteries');
                let q = query(lotteriesRef);
                if (filterByClientId) q = query(q, where("clientId", "==", filterByClientId));
                if (filterByState) q = query(q, where("state", "==", filterByState));
                const lotteries = await getDocs(q);
                lotteries.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    listOfLotteries.push(data);
                })
            }
            // Add client data to club data
            await Promise.all(listOfLotteries.map( async clientLottery => {
                const lotteryRef = doc(db, 'Clients', clientLottery.clientId);
                const docSnap1 = await getDoc(lotteryRef);
                if (docSnap1.exists()) {
                    const dataClient = docSnap1.data();
                    clientLottery.client = dataClient;
                }
                return clientLottery
            }))
            res.json({ results: listOfLotteries })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * tags:
     *   name: Lottery
     *   description: Operations about lotteries
     * 
     * /v1.0/newLottery:
     *   post:
     *     tags: [Lottery]
     *     summary: Create a new lottery. Requires JWT
     *     description: Create a new lottery and save it to the Lotteries collection.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstNumber:
     *                 type: number
     *                 description: The first number of the lottery.
     *               totalNumbers:
     *                 type: number
     *                 description: The total numbers of the lottery.
     *               dateOfLottery:
     *                 type: string
     *                 format: date 
     *                 description: The date of the lottery.
     *               dateLimitOfBets:
     *                 type: string
     *                 format: date
     *                 description: The limit date to make bets.
     *               betPrice:
     *                 type: number
     *                 description: The price of the bet.
     *               howToWin:
     *                 type: string
     *                 description: How to select the winner number.
     *               lotteryPrize:
     *                 type: string
     *                 description: The prize for the winner.
     *               winnerNumber:
     *                 type: string
     *                 description: The number that win the lottery.
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The lottery was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Lottery'
     *       500:
     *         description: An error occurred while creating the lottery.
     */
    async createLottery (req, res, next) {
        const { firstNumber, totalNumbers, dateOfLottery, dateLimitOfBets, betPrice, howToWin, lotteryPrize, state, numberOfWinners, selectedNumber, result } = req.body
        const clientId = req.userLoggedApi
        const db = getFirestore(appFirebase)
        try {
            // Create club
            const createdAt = new Date().toISOString()
            const lotteryToCreate = {
                clientId, 
                firstNumber, 
                totalNumbers, 
                dateOfLottery, 
                dateLimitOfBets, 
                betPrice, 
                howToWin, 
                lotteryPrize, 
                createdAt,
                state,
                numberOfWinners,
                selectedNumber,
                result
            }
            const createdLottery = await addDoc(collection(db, 'Lotteries'), lotteryToCreate)
            // Add id to createdLottery
            lotteryToCreate.id = createdLottery.id
            // Return response
            res.json({ results: lotteryToCreate });
        } catch (error) {
            console.log('CreateLottery: ', error)
            res.status(500).json({ error: 'An error occurred while creating the lottery.'})
        }
    }

    /**
     * @swagger
     * tags:
     *   name: Lottery
     *   description: Operations about lotteries
     * 
     * /v1.0/updateLottery/{id}:
     *   put:
     *     tags: [Lottery]
     *     summary: Update an existing lottery. Requites JWT
     *     description: Update an existing lottery and save it to the Lotteries collection. The lottery owner must be the owner of the token.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The lottery id
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstNumber:
     *                 type: number
     *                 description: The first number of the lottery.
     *               totalNumbers:
     *                 type: number
     *                 description: The total numbers of the lottery.
     *               dateOfLottery:
     *                 type: string
     *                 format: date 
     *                 description: The date of the lottery.
     *               dateLimitOfBets:
     *                 type: string
     *                 format: date
     *                 description: The limit date to make bets.
     *               betPrice:
     *                 type: number
     *                 description: The price of the bet.
     *               howToWin:
     *                 type: string
     *                 description: How to select the winner number.
     *               lotteryPrize:
     *                 type: string
     *                 description: The prize for the winner.
     *               winnerNumber:
     *                 type: string
     *                 description: The number that win the lottery.
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The lottery was updated successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Lottery'
     *       404:
     *         description: The lottery was not found.
     *       500:
     *         description: An error occurred while updating the lottery.
     */
    async updateLottery (req, res, next) {
        const { firstNumber, totalNumbers, dateOfLottery, dateLimitOfBets, betPrice, howToWin, lotteryPrize, state, result, closedAt, winner } = req.body
        const clientId = req.userLoggedApi
        const { id } = req.params;
        const db = getFirestore(appFirebase);
        try {
            const lotteryRef = doc(db, 'Lotteries', id);
            const docSnap = await getDoc(lotteryRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.clientId !== clientId) {
                    res.status(404).json({ error: `The lottery '${id}' is not property of the token owner. We can't update it.`})
                    return
                }
            } else {
                throw new Error(`The lottery '${id}' was not found.`);
            }
            const lotteryToUpdate = {};
            // Update data if exits
            if (clientId) lotteryToUpdate.clientId = clientId;
            if (firstNumber) lotteryToUpdate.firstNumber = firstNumber;
            if (totalNumbers) lotteryToUpdate.totalNumbers = totalNumbers;
            if (dateOfLottery) lotteryToUpdate.dateOfLottery = dateOfLottery;
            if (dateLimitOfBets) lotteryToUpdate.dateLimitOfBets = dateLimitOfBets;
            if (betPrice) lotteryToUpdate.betPrice = betPrice;
            if (howToWin) lotteryToUpdate.howToWin = howToWin;
            if (lotteryPrize) lotteryToUpdate.lotteryPrize = lotteryPrize;
            if (state) lotteryToUpdate.state = state;
            if (result) lotteryToUpdate.result = result;
            if (closedAt) lotteryToUpdate.closedAt = closedAt;
            if (winner) lotteryToUpdate.winner = winner;
            lotteryToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(lotteryRef, lotteryToUpdate);
            res.json({ results: { id, ...lotteryToUpdate } });
        } catch (error) {
            console.log('UpdateLottery: ', error)
            res.status(404).json({ error: `The lottery '${req.params.id}' was not found.`})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteLottery/{id}:
     *   delete:
     *     tags: [Lottery]
     *     summary: Delete a lottery
     *     description: Delete a lottery from the Lotteries collection and all his bets. The lottery owner must be the owner of the token.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the lottery to delete.
     *         schema:
     *           type: string
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The lottery was deleted successfully.
     *       404:
     *         description: The lottery was not found.
     *       500:
     *         description: An error occurred while deleting the lottery.
     */
    async deleteLottery (req, res, next) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`Not lottery delivery.`);
        }
        const db = getFirestore(appFirebase);
        try {
            const lotteryRef = doc(db, 'Lotteries', id);
            const lotterySnap = await getDoc(lotteryRef);
            if (!lotterySnap.exists()) {
                throw new Error(`The lottery '${id}' was not found.`);
            }
            const data = lotterySnap.data();
            if (data.clientId !== req.userLoggedApi) {
                res.status(404).json({ error: `The lottery '${id}' is not property of the token owner. We can't delete it.`})
                return
            }
            await deleteLotteryBets(id)
            await deleteDoc(lotteryRef);
            res.json({ message: `Lottery '${id}' was deleted successfully.` });
        } catch (error) {
            console.log('DeletteLottery: ', error)
            res.status(404).json({ error: error.message})
        }
    }
}

export default LotteryController