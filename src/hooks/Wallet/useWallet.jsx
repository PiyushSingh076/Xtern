import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { useAuth } from "../Auth/useAuth";
import toast from "react-hot-toast";
import { query } from "firebase/database";

export const useWallet = () => {
  const [wallet, setWallet] = useState();
  const [loaded, setLoaded] = useState(false);
  const { refresh } = useAuth();
  

  async function creditWallet(uid, amount, description){
    await setDoc(
      doc(db, "wallet", uid),{
        amount: increment(amount)
      }, {merge: true})
    await createTransaction(uid, amount, "CREDIT", description)
  }

  async function buyService(uid, amount, description, service){
    
    await debitWallet(uid, amount, "Service bought - " + service.serviceName, service)
    await creditWallet(service.userRef.id, service.servicePrice,"Service payment - " + service.serviceName)

   
    
  }

  async function getTransactions(uid) {
    const q = query(
      collection(db, "transactions"),
      where("walletId", "==", uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q, );
    const transactions = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    
  
    return transactions;
  }

  async function createTransaction(uid, amount, type, description, details) {
    try {
      const transaction = await addDoc(collection(db, "transactions"), {
        walletId: uid,
        amount: amount,
        type: type,
        description: description,
        date: new Date(),
        details: details || {}
      });
      await setDoc(
        doc(db, "wallet", uid),
        {
          transactions: arrayUnion(transaction.id),
          
        },
        { merge: true }
      );
    } catch (error) {
      toast.error("Error creating transaction");
    }
  }

  async function requestWithdraw(uid, amount, bankDetails) {
    try {
      await updateDoc(doc(db, "wallet", uid), {
        amount: increment(-amount),
      })
      await createTransaction(uid, amount, "PENDING", "Withdrawal request", bankDetails);

      toast.success("Withdrawal request created successfully, please wait for approval");
    } catch (error) {
      toast.error("Error creating withdrawal request, please try again");
    }
  }

  async function debitWallet(uid, amount, description, details) {
    try {
      const transaction = await addDoc(collection(db, "transactions"), {
        walletId: uid,
        amount: amount,
        type: "DEBIT",
        description: description,
        date: new Date(),
        
        details: details,
      });
      await setDoc(
        doc(db, "wallet", uid),
        {
          amount: increment(-amount),
          transactions: arrayUnion(transaction.id),
        },
        { merge: true }
      );
      toast.success("Amount debited successfully");
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  async function createWallet(uid) {
    await setDoc(doc(db, "wallet", uid), {
      amount: 0,
    });
  }

  async function getAmountInWallet(uid) {
    const walletSnapshot = await getDoc(doc(db, "wallet", uid));
    if (walletSnapshot.exists()) {
      const walletData = walletSnapshot.data();
      return walletData.amount;
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const walletSnapshot = await getDoc(doc(db, "wallet", user.uid));
        if (walletSnapshot.exists()) {
          setWallet(walletSnapshot.data());
          setLoaded(true);
        } else {
          await createWallet(user.uid);
          setWallet({ amount: 0 });
          setLoaded(true);
        }
      }
    });
  }, [refresh]);

  return {
    wallet,
    loaded,
    createTransaction,
    getTransactions,
    getAmountInWallet,
    debitWallet,
    buyService,
    requestWithdraw
  };
};

export default useWallet;
