import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuth } from '../Auth/useAuth';

export const useWallet = () => {
    const [wallet,setWallet] = useState();
    const [loaded, setLoaded] = useState(false)
    const {refresh} = useAuth()

    async function requestWithdraw(uid, amount){
        try {
            const walletSnapshot = await getDoc(doc(db, "wallet", uid));
            if(walletSnapshot.exists()){
                const walletData = walletSnapshot.data();
                if(walletData.amount >= amount){
                    // request code here
                    toast.success("Withdrawal request sent successfully")
                }
                else {
                    toast.error("Insufficient balance")
                }
            }
        } catch (error) {
            console.error("Error requesting withdrawal:", error);
            toast.error("A error occurred, try again later.")
        }

    }
    

    async function createWallet(uid){
        await setDoc(doc(db, "wallet", uid), {
            amount: 0,

        })
        
    }

    

    useEffect(()=> {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                const walletSnapshot = await getDoc(doc(db, "wallet", user.uid));
                if(walletSnapshot.exists()){
                    setWallet(walletSnapshot.data());
                    setLoaded(true)
                }
                else {
                    await createWallet(user.uid)
                    setWallet({amount: 0})
                    setLoaded(true)
                }
            }
        })
    }, [refresh])

    return {wallet, loaded}
}

export default useWallet