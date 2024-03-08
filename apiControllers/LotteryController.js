import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore"


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
     *     description: Retrieve a list of lotteries from the Lotteries collection. The list can be used to populate a lottery management dashboard.
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
        const db = getFirestore(appFirebase)
        try {
            const listOfLotteries = []
            const lotteries = await getDocs(collection(db, "Lotteries"))
            lotteries.forEach( doc => {
                const data = doc.data()
                data.id = doc.id
                listOfLotteries.push(data)
            })
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
     *     summary: Create a new lottery
     *     description: Create a new lottery and save it to the Lotteries collection.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               clientId:
     *                 type: string
     *                 description: The client that create the lottery.
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
        const { clientId, firstNumber, totalNumbers, dateOfLottery, dateLimitOfBets, betPrice, howToWin, lotteryPrize } = req.body
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
            }
            const createdLottery = await addDoc(collection(db, 'Lotteries'), lotteryToCreate)
            // Add id to createdLottery
            lotteryToCreate.id = createdLottery.id
            // Return response
            res.json({ results: lotteryToCreate });
        } catch (error) {
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
     *     summary: Update an existing lottery
     *     description: Update an existing lottery and save it to the Lotteries collection.
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
     *               clientId:
     *                 type: string
     *                 description: The client that create the lottery.
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
        const { clientId, firstNumber, totalNumbers, dateOfLottery, dateLimitOfBets, betPrice, howToWin, lotteryPrize } = req.body
        const { id } = req.params;
        const db = getFirestore(appFirebase);
        try {
            const lotteryRef = doc(db, 'Lotteries', id);
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
            lotteryToUpdate.modifiedAt = new Date().toISOString()
            await updateDoc(lotteryRef, lotteryToUpdate);
            res.json({ results: { id, ...lotteryToUpdate } });
        } catch (error) {
            res.status(404).json({ error: `The lottery '${req.params.id}' was not found.`})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteLottery/{id}:
     *   delete:
     *     tags: [Lottery]
     *     summary: Delete a lottery
     *     description: Delete a lottery from the Lotteries collection.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the lottery to delete.
     *         schema:
     *           type: string
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
            await deleteDoc(lotteryRef);
            res.json({ message: `Lottery '${id}' was deleted successfully.` });
        } catch (error) {
            res.status(404).json({ error: error.message})
        }
    }
}

export default LotteryController