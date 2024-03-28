import { appFirebase } from "../app.js"
import { getFirestore, collection, getDocs, deleteDoc, query, where } from "firebase/firestore"

// Function to delete clubs from a clientId
export async function deleteClubs(clientId) {
    const db = getFirestore(appFirebase);
    try {
        // Delete clubs
        const clubsRef = collection(db, 'Clubs');
        const q = query(clubsRef, where("clientId", "==", clientId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach( async (doc) => {
            // Delete Club Bets
            await deleteClubBets(doc.id)
            await deleteDoc(doc.ref)
        });
        // Delete lotteries
        const lotteriesRef = collection(db, 'Lotteries');
        const ql = query(lotteriesRef, where("clientId", "==", clientId));
        const querySnapshotl = await getDocs(ql);
        querySnapshotl.forEach( async (doc) => {
            // Delete Lottery Bets
            await deleteLotteryBets(doc.id)
            await deleteDoc(doc.ref)
        });
    } catch (error) {
        throw new Error(`Error deleting the client. ${error.message}`);
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

