import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebaseConfig"

export function useNotifications () {
    async function createNotification(type, item, uid){
        if(type === "INVITE"){
            await addDoc(collection(db, "notifications"), {
                data: item,
                opened: false,
                uid: uid,
                type: "INVITE"

            })
        }
    }


    return {createNotification}
}