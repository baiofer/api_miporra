import bcrypt from 'bcrypt'

class LoginController {

    // Instance method to check an user password
    comparePassword = (plainPassword) => {
    return bcrypt.compare(plainPassword, this.password)
}

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Operations about clients
 * 
 * /v1.0/login:
 *   get:
 *     tags: [Clients]
 *     summary: Login a client
 *     description: Check if password an email are corrects.
 *     responses:
 *       200:
 *         description: An OK or NOT OK is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clients'
 *       500:
 *         description: An error occurred while retrieving the clients.
 */
    login = async (req, res, next) => {
        const db = getFirestore(appFirebase)
        try {
            const client = await getDoc(clientRef).data()
            const newPassword =  await this.hashPassword(password)
            res.json({ results: listOfClients })
        } catch (error) {
            next(error)
        }
    }
}

export default LoginController