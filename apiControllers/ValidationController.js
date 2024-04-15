import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, deleteDoc, query, where } from "firebase/firestore"


class ValidationsController {

    /**
     * @swagger
     * tags:
     *   name: Validations
     *   description: Operations about validations
     * 
     * /v1.0/validationsJwt:
     *   get:
     *     tags: [Validations]
     *     summary: Retrieve the list of validations of the jwt owner.
     *     description: Retrieve a list of validations from the Validations collection. The list contains the list of bets to validate by the owner of the club of bet.
     *     parameters:
     *       - in: query
     *         name: id
     *         description: ID to filter by. Using this parameter, overrides the others.
     *         schema:
     *           type: string 
     *       - in: query
     *         name: type
     *         description: Type to filter by.
     *         schema:
     *           type: string
     *           enum: [club, lottery]
     *     security:
     *       - JWTAuth: []  
     *     responses:
     *       200:
     *         description: A list of validations was retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Validations'
     *       500:
     *         description: An error occurred while retrieving the validations.
     */
    async getValidationsJWT (req, res, next) {
        const filterById = req.query.id
        // The clientId comes in req.userLoggedApi
        const filterByClientId = req.userLoggedApi
        const filterByType = req.query.type
        const db = getFirestore(appFirebase)
        try {
            const listOfValidations = []
            // Filter by Id
            if (filterById) {
                const docRef = doc(db, 'Validations', filterById);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    data.id = docSnap.id;
                    listOfValidations.push(data);
                }
            // Filter by the rest of params
            } else {
                const validationsRef = collection(db, 'Validations');
                let q = query(validationsRef);
                if (filterByClientId) q = query(q, where("clientId", "==", filterByClientId));
                if (filterByType) q = query(q, where("type", "==", filterByType));
                const validations = await getDocs(q);
                validations.forEach(async validation => {
                    const data = validation.data();
                    data.id = validation.id;
                    listOfValidations.push(data);
                })
            }
            res.json({ results: listOfValidations })
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * tags:
     *   name: Validations
     *   description: Operations about validations
     * 
     * /v1.0/newValidation:
     *   post:
     *     tags: [Validations]
     *     summary: Create a new validation
     *     description: Create a new validation and save it to the Validations collection. The ownwer of the validation is the owner of the token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               number:
     *                 type: string
     *                 description: The number of the validation.
     *               clientId:
     *                 type: string
     *                 description: The clientId to witch the club or lottery bet belongs.
     *               type:
     *                 type: string
     *                 enum: [club, lottery]
     *                 description: The type of the bet (club / lottery).
     *               bet:
     *                 type: object
     *                 description: The bet to validate (club or lottery).
     *     responses:
     *       200:
     *         description: The validation was created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Validations'
     *       500:
     *         description: An error occurred while creating the validation.
     */
    async createValidation (req, res, next) {
        const { number, type, clientId, bet } = req.body
        // The clientId comes in req.userLoggedApi
        const db = getFirestore(appFirebase)
        try {
            // Create validation
            const createdAt = new Date().toISOString()
            const validationToCreate = {
                number,
                clientId,
                type, 
                bet,
                createdAt,
            }
            if (type !== "club") {
                // Get all bets from the lotteryId
                const selectedNumbers = []
                const lotteryBetsRef = collection(db, 'LotteryBets');
                let q = query(lotteryBetsRef);
                q = query(q, where("lotteryId", "==", bet.lotteryId));
                const lotteryBets = await getDocs(q);
                lotteryBets.forEach(doc => {
                    const data = doc.data();
                    // Get numbers selected
                    selectedNumbers.push(parseInt(data.selectedNumber));
                })
                // Get all bets from validations
                const validationsRef = collection(db, "Validations")
                let q1 = query(validationsRef);
                q1 = query(q1, where("type", "==", "lottery"));
                const validations = await getDocs(q1);
                validations.forEach(validation => {
                    const data = validation.data();
                    // Get numbers selected
                    selectedNumbers.push(parseInt(data.bet.selectedNumber));
                })
                // If selectedNumber in lotteryBetToCreate is included in numbersSelected, respond a message indicating that the selecterNumber is already selected.
                if (selectedNumbers.includes(bet.selectedNumber)) {
                    return res.json({ results: {response: `The number ${bet.selectedNumber} is already selected` }});
                }
            }
            // Add validation to table
            const createdValidation = await addDoc(collection(db, 'Validations'), validationToCreate)
            // Add id to createdValidation
            validationToCreate.id = createdValidation.id
            // Return response
            res.json({ results: validationToCreate });
        } catch (error) {
            console.log('CreateValidation: ', error)
            res.status(500).json({ error: 'An error occurred while creating the validation.'})
        }
    }

     /**
     * @swagger
     * /v1.0/deleteValidation/{id}:
     *   delete:
     *     tags: [Validations]
     *     summary: Delete a validation
     *     description: Delete a validation from the Validations collection. The clientId owner of the validation, must be the owner of the token.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The id of the validation to delete.
     *         schema:
     *           type: string
     *     security:
     *       - JWTAuth: []
     *     responses:
     *       200:
     *         description: The validation was deleted successfully.
     *       404:
     *         description: The validation was not found.
     *       500:
     *         description: An error occurred while deleting the validation.
     */
     async deleteValidation (req, res, next) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`Not validation delivery.`);
        }
        const db = getFirestore(appFirebase);
        try {
            const validationRef = doc(db, 'Validations', id);
            const clubSnap = await getDoc(validationRef);
            if (!clubSnap.exists()) {
                throw new Error(`The validation '${id}' was not found.`);
            }
            const data = clubSnap.data();
            if (data.clientId !== req.userLoggedApi) {
                res.status(404).json({ error: `The validation '${id}' is not property of the token owner. We can't delete it.`})
                return
            }
            await deleteDoc(validationRef);
            res.json({ message: `Validation '${id}' was deleted successfully.` });
        } catch (error) {
            console.log('DeleteValidation: ', error)
            res.status(404).json({ error: error.message})
        }
    }
}

export default ValidationsController