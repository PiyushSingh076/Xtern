import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig";

export const useEntrepreneurDetails =  (uid) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            const data = (await getDoc(doc(db, "users",uid ))).data();
            console.log(data);
            setUserData(data);
            setLoading(false);
        }
        fetchUserData();
    }, [uid])

    return {loading, userData}
}