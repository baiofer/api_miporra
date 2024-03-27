import firebaseConfig from "../lib/firebaseConfig.js"
import readline from 'node:readline'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, limit, writeBatch } from "firebase/firestore"
import { getStorage, ref, listAll, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { resizeImage } from "../lib/resizeImage.js";
import bcrypt from 'bcrypt'



main().catch( err => console.log('Hubo un error', err))

async function main() {
    // Init firebase
    const appFirebase = initializeApp(firebaseConfig)
    const db = getFirestore(appFirebase);

    // Confirmation message
    const deleteQuestion = await question('¿Estas seguro de que quieres borrar la base de datos y cargar datos iniciales? (si/no)  ')
    if (!deleteQuestion) { process.exit()}
    
    // Delete collections
    await deleteCollection(db, 'Clients', 100);
    await deleteCollection(db, 'Clubs', 100)
    await deleteCollection(db, 'ClubBets', 100)
    await deleteCollection(db, 'Lotteries', 100)
    await deleteCollection(db, 'LotteryBets', 100)
    await deleteFolderContents('/logo')
    
    // Init Clients
    const clientsCreated = await initClients(appFirebase)
    // Init Clubs
    const clubsCreated = await initClubs(appFirebase, clientsCreated)
    // Init ClubBets
    await initClubBets(appFirebase, clubsCreated)
    // Init Lotteries
    const lotteriesCreated = await initLotteries(appFirebase, clientsCreated)
    // Init ClubBets
    await initLotteryBets(appFirebase, lotteriesCreated)
}

async function initClients(appFirebase) {
    const client1 = {
        name: 'Fernando',
        email: 'fjarilla@gmail.com',
        password: '123456',
        filename: '1.webp'
    }
    const client2 = {
        name: 'Carlos',
        email: 'carlos.hernandez@motork.io',
        password: '123456',
        filename: '2.webp'
    }
    const client3 = {
        name: 'Luis',
        email: 'luis@luis.com',
        password: '123456',
        filename: '3.webp'
    }
    const client4 = {
        name: 'Pedro',
        email: 'pedro@pedro.com.com',
        password: '123456',
        filename: '4.webp'
    }
    const clientId1 = await createClient(client1, appFirebase)
    const clientId2 = await createClient(client2, appFirebase)
    const clientId3= await createClient(client3, appFirebase)
    const clientId4 = await createClient(client4, appFirebase)
    return { clientId1, clientId2, clientId3, clientId4 }
}

async function initClubs(appFirebase, clientsCreated) {
    const { clientId1, clientId2, clientId3, clientId4 } = clientsCreated
    const club1 = {
        match1HomeTeam: 'Real Sociedad', 
        match1AwayTeam: "Athetic de Bilbao", 
        match1Date: '30/03/24', 
        match1Hour: '18:00', 
        match2HomeTeam: 'Real Madrid', 
        match2AwayTeam: 'Atletico de Madrid', 
        match2Date: '30/03/24', 
        match2hour: '21:00', 
        betPrice: 2, 
        accumulatedPrize: 4, 
        accumulatedJackpot: 0, 
        limitDateForBets: '30/03/24', 
        limitHourForBets: '17:00', 
        state: 'in progress', 
        numberOfWinners: 0,
        clientId: clientId1,
    }
    const club2 = {
        match1HomeTeam: 'Almeria', 
        match1AwayTeam: "Granada", 
        match1Date: '30/03/24', 
        match1Hour: '18:00', 
        match2HomeTeam: 'Betis', 
        match2AwayTeam: 'Sevilla', 
        match2Date: '30/03/24', 
        match2hour: '21:00', 
        betPrice: 2, 
        accumulatedPrize: 4, 
        accumulatedJackpot: 0, 
        limitDateForBets: '30/03/24', 
        limitHourForBets: '17:00', 
        state: 'in progress', 
        numberOfWinners: 0,
        clientId: clientId1,
    }
    const club3 = {
        match1HomeTeam: 'Barcelona', 
        match1AwayTeam: "Girona", 
        match1Date: '30/03/24', 
        match1Hour: '18:00', 
        match2HomeTeam: 'Celta', 
        match2AwayTeam: 'Alaves', 
        match2Date: '30/03/24', 
        match2hour: '21:00', 
        betPrice: 2, 
        accumulatedPrize: 4, 
        accumulatedJackpot: 0, 
        limitDateForBets: '30/03/24', 
        limitHourForBets: '17:00', 
        state: 'in progress', 
        numberOfWinners: 0,
        clientId: clientId1,
    }
    const club4 = {
        match1HomeTeam: 'Osasuna', 
        match1AwayTeam: "Valencia", 
        match1Date: '30/03/24', 
        match1Hour: '18:00', 
        match2HomeTeam: 'Las Palmas', 
        match2AwayTeam: 'Cadiz', 
        match2Date: '30/03/24', 
        match2hour: '21:00', 
        betPrice: 2, 
        accumulatedPrize: 4, 
        accumulatedJackpot: 0, 
        limitDateForBets: '30/03/24', 
        limitHourForBets: '17:00', 
        state: 'in progress', 
        numberOfWinners: 0,
        clientId: clientId2,
    }
    const clubId1 = await createClub(club1, appFirebase)
    const clubId2 = await createClub(club2, appFirebase)
    const clubId3 = await createClub(club3, appFirebase)
    const clubId4 = await createClub(club4, appFirebase)
    return { clubId1, clubId2, clubId3, clubId4 }
}

async function initClubBets(appFirebase, clubsCreated) {
    const { clubId1, clubId2, clubId3, clubId4 } = clubsCreated

    const clubBet1 = {
        clubId: clubId1, 
        userEmail: 'isabel@isabel.com', 
        userName: 'Isabel', 
        match1HomeTeamResult: '2', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '3', 
        match2AwayTeamResult: '3', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet2 = {
        clubId: clubId1, 
        userEmail: 'ana@ana.com', 
        userName: 'Ana', 
        match1HomeTeamResult: '0', 
        match1AwayTeamResult: '1', 
        match2HomeTeamResult: '1', 
        match2AwayTeamResult: '1', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet3 = {
        clubId: clubId1, 
        userEmail: 'federico@federico.com', 
        userName: 'Federico', 
        match1HomeTeamResult: '0', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '0', 
        match2AwayTeamResult: '0', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet4 = {
        clubId: clubId1, 
        userEmail: 'paula@paula.com', 
        userName: 'Paula', 
        match1HomeTeamResult: '0', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '0', 
        match2AwayTeamResult: '0', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet5 = {
        clubId: clubId2, 
        userEmail: 'luis@luis.com', 
        userName: 'Luis', 
        match1HomeTeamResult: '2', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '2', 
        match2AwayTeamResult: '0', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet6 = {
        clubId: clubId2, 
        userEmail: 'luis@luis.com', 
        userName: 'Luis', 
        match1HomeTeamResult: '1', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '3', 
        match2AwayTeamResult: '1', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet7 = {
        clubId: clubId2, 
        userEmail: 'andres@andres.com', 
        userName: 'Andres', 
        match1HomeTeamResult: '0', 
        match1AwayTeamResult: '1', 
        match2HomeTeamResult: '2', 
        match2AwayTeamResult: '1', 
        betDate: '27/03/24', 
        betPrice: '2'
    }
    const clubBet8 = {
        clubId: clubId3, 
        userEmail: 'andres@andres.com', 
        userName: 'Andres', 
        match1HomeTeamResult: '0', 
        match1AwayTeamResult: '0', 
        match2HomeTeamResult: '0', 
        match2AwayTeamResult: '0', 
        betDate: '27/03/24', 
        betPrice: '2'
    }

    await createClubBet(clubBet1, appFirebase)
    await createClubBet(clubBet2, appFirebase)
    await createClubBet(clubBet3, appFirebase)
    await createClubBet(clubBet4, appFirebase)
    await createClubBet(clubBet5, appFirebase)
    await createClubBet(clubBet6, appFirebase)
    await createClubBet(clubBet7, appFirebase)
    await createClubBet(clubBet8, appFirebase)
}

async function initLotteries(appFirebase, clientsCreated) {
    const { clientId1, clientId2, clientId3, clientId4 } = clientsCreated
    const lottery1 = {
        firstNumber: '0', 
        totalNumbers: '100', 
        dateOfLottery: '30/03/24', 
        dateLimitOfBets: '29/03/24', 
        betPrice: 2, 
        howToWin: 'Dos ultimas cifras del sorteo de la ONCE', 
        lotteryPrize: 'Camiseta personalizada de la Real Sociedad', 
        clientId: clientId2
    }
    const lottery2 = {
        firstNumber: '0', 
        totalNumbers: '100', 
        dateOfLottery: '30/03/24', 
        dateLimitOfBets: '29/03/24', 
        betPrice: 2, 
        howToWin: 'Dos ultimas cifras del sorteo de la ONCE', 
        lotteryPrize: 'Lote de ibéricos', 
        clientId: clientId1
    }
    const lottery3 = {
        firstNumber: '0', 
        totalNumbers: '100', 
        dateOfLottery: '30/03/24', 
        dateLimitOfBets: '29/03/24', 
        betPrice: 2, 
        howToWin: 'Dos ultimas cifras del sorteo de la ONCE', 
        lotteryPrize: 'Cena para 2 personas en restaurante Arzak', 
        clientId: clientId3
    }
    const lottery4 = {
        firstNumber: '0', 
        totalNumbers: '100', 
        dateOfLottery: '30/03/24', 
        dateLimitOfBets: '29/03/24', 
        betPrice: 2, 
        howToWin: 'Dos ultimas cifras del sorteo de la ONCE', 
        lotteryPrize: 'Una noche de estancia en el Hotel Maria Cristina', 
        clientId: clientId4
    }
    const lotteryId1 = await createLottery(lottery1, appFirebase)
    const lotteryId2 = await createLottery(lottery2, appFirebase)
    const lotteryId3 = await createLottery(lottery3, appFirebase)
    const lotteryId4 = await createLottery(lottery4, appFirebase)
    return { lotteryId1, lotteryId2, lotteryId3, lotteryId4 }
}

async function initLotteryBets(appFirebase, lotteriesCreated) {
    const { lotteryId1, lotteryId2, lotteryId3, lotteryId4 } = lotteriesCreated
    const lotteryBet1 = {
        lotteryId: lotteryId1, 
        userEmail: 'andres@andres.com', 
        userName:'Andres', 
        selectedNumber: '27', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet2 = {
        lotteryId: lotteryId1, 
        userEmail: 'andres@andres.com', 
        userName:'Andres', 
        selectedNumber: '61', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet3 = {
        lotteryId: lotteryId1, 
        userEmail: 'luis@luis.com', 
        userName:'Luis', 
        selectedNumber: '00', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet4 = {
        lotteryId: lotteryId1, 
        userEmail: 'paula@paula.com', 
        userName:'Paula', 
        selectedNumber: '99', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet5 = {
        lotteryId: lotteryId1, 
        userEmail: 'maria@maria.com', 
        userName:'Maria', 
        selectedNumber: '86', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet6 = {
        lotteryId: lotteryId1, 
        userEmail: 'angel@angel.com', 
        userName:'Angel', 
        selectedNumber: '14', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet7 = {
        lotteryId: lotteryId2, 
        userEmail: 'javi@javi.com', 
        userName:'Javi', 
        selectedNumber: '55', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    const lotteryBet8 = {
        lotteryId: lotteryId3, 
        userEmail: 'elena@elena.com', 
        userName:'Elena', 
        selectedNumber: '55', 
        betDate: '27/03/24', 
        betPrice: 2
    }
    await createLotteryBet(lotteryBet1, appFirebase)
    await createLotteryBet(lotteryBet2, appFirebase)
    await createLotteryBet(lotteryBet3, appFirebase)
    await createLotteryBet(lotteryBet4, appFirebase)
    await createLotteryBet(lotteryBet5, appFirebase)
    await createLotteryBet(lotteryBet6, appFirebase)
    await createLotteryBet(lotteryBet7, appFirebase)
    await createLotteryBet(lotteryBet8, appFirebase)
}

//================================================================

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

function question(text) {
    return new Promise( (resolve, reject) => {
        // Connect readline with the console.
        const interf = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        interf.question(text, response => {
            interf.close()
            resolve(response.toLowerCase() === 'si')
        })
    })
}

async function deleteFolderContents(path) {
    const storage = getStorage();
    const folderRef = ref(storage, path);
  
    const res = await listAll(folderRef);
  
    res.items.forEach((itemRef) => {
      deleteObject(itemRef);
    });
  }

// Function to hash a password
function hashPassword(plainPassword) {
    return bcrypt.hash(plainPassword, 7)
}

async function createClient(client, appFirebase) {
    const { name, email, password, filename } = client
    const db = getFirestore(appFirebase)
    const storage = getStorage()
    try {
        //Get file and store it
        let logoUrl = ''
        
        const storageRef = ref(storage, `logo/${filename}`);
        const imageResized = await resizeImage(`logosInitDB/${filename}`)
        const snapshot = await uploadBytes(storageRef, imageResized);
        logoUrl = await getDownloadURL(snapshot.ref);
        //await unlink(`logosInitDB/${filename}`);
        
        // Create client
        const newPassword = await hashPassword(password)
        const createdAt = new Date().toISOString()
        const clientToCreate = {
            name,
            email,
            password: newPassword,
            logo: logoUrl,
            createdAt,
        }
        const createdClient = await addDoc(collection(db, 'Clients'), clientToCreate)
        return createdClient.id
    } catch (error) {
        console.log(error)
        console.log('An error occurred while creating the client.')
    }
}

async function createClub(club, appFirebase) {
    const { match1HomeTeam, match1AwayTeam, match1Date, match1Hour, match2HomeTeam, match2AwayTeam, match2Date, match2hour, betPrice, accumulatedPrize, accumulatedJackpot, limitDateForBets, limitHourForBets, state, numberOfWinners, clientId } = club
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
        return createdClub.id
    } catch (error) {
        console.log('An error occurred while creating the club.')
    }
}

async function createClubBet(clubBet, appFirebase) {
    const { clubId, userEmail, userName, match1HomeTeamResult, match1AwayTeamResult, match2HomeTeamResult, match2AwayTeamResult, betDate, betPrice } = clubBet
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
    } catch (error) {
        console.log('An error occurred while creating the club bet.')
    }
}

async function createLottery(lottery, appFirebase) {
    const { firstNumber, totalNumbers, dateOfLottery, dateLimitOfBets, betPrice, howToWin, lotteryPrize, clientId } = lottery
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
        return createdLottery.id
    } catch (error) {
        console.log('An error occurred while creating the lottery.')
    }
}

async function createLotteryBet(lotteryBet, appFirebase) {
    const { lotteryId, userEmail, userName, selectedNumber, betDate, betPrice } = lotteryBet
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
    } catch (error) {
        console.log('An error occurred while creating the lottery bet.')
    }
}