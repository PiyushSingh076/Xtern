import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebaseConfig';
import { useAuth } from '../Auth/useAuth';

export const useWallet = () => {
    const [wallet,setWallet] = useState();
    const [loaded, setLoaded] = useState(false)
    const {refresh} = useAuth()

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