import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, getDoc, deleteDoc, query, where } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// Function to delete clubs from a clientId
export async function deleteClubs(clientId) {
    const db = getFirestore(appFirebase);
    try {
        const listOfClubs = []
        const docRef = doc(db, 'Clubs', clientId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            data.id = docSnap.id;
            listOfClubs.push(data);
        }
        listOfClubs.map( async club => {
            await deleteClubBets(club.id)
            const clubRef = doc(db, 'Clubs', id);
            const clubSnap = await getDoc(clubRef);
            if (!clubSnap.exists()) {
                throw new Error(`The club '${id}' was not found.`);
            }
            await deleteDoc(clubRef);
        })
    } catch (error) {
        throw new Error(`Error deleting clubs. ${error.message}`);
    }
}

// Function to delete club bets from a club
export async function deleteClubBets(clubId) {
    const db = getFirestore(appFirebase);
    try {
        const clubBetsRef = collection(db, 'ClubBets');
        const q = query(clubBetsRef, where("clubId", "==", clubId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach( async (doc) => {
            await deleteDoc(doc.ref)
        });
    } catch (error) {
        throw new Error(`Error deleting club bets. ${error.message}`);
    }
}

// Function to delete lottery bets from a lottery
export async function deleteLotteryBets(lotteryId) {
    const db = getFirestore(appFirebase);
    try {
        const lotteryBetsRef = collection(db, 'LotteryBets');
        const q = query(lotteryBetsRef, where("lotteryId", "==", lotteryId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach( async (doc) => {
            await deleteDoc(doc.ref)
        });
    } catch (error) {
        throw new Error(`Error deleting lottery bets. ${error.message}`);
    }
}

