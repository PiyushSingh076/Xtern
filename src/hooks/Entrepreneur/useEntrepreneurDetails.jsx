import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig";

export const useEntrepreneurDetails =  (uid) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(false)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
            const data = (await getDoc(doc(db, "users",uid ))).data();
            if(data === undefined || data===null){
                setError(true)
                setLoading(false)
                return
            }
            setUserData(data);
            setLoading(false);
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchUserData();
    }, [uid])

    return {loading, userData}
}