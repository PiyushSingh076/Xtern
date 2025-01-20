import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
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
      where("walletId", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map((doc) => doc.data());
    transactions.sort((a, b) => {
      if (!a.date && !b.date) return 0; // Both dates are null
      if (!a.date) return 1; // a.date is null, push it to the end
      if (!b.date) return -1; // b.date is null, push it to the end
      return b.date.toMillis() - a.date.toMillis(); // Compare non-null dates
    });
  
    return transactions;
  }

  async function createTransaction(uid, amount, type, description) {
    try {
      const transaction = await addDoc(collection(db, "transactions"), {
        walletId: uid,
        amount: amount,
        type: type,
        description: description,
        date: new Date(),
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

  async function requestWithdraw(uid, amount) {
    try {
      await updateDoc(doc(db, "wallet", uid), {
        amount: increment(-amount),
      })
      await createTransaction(uid, amount, "PENDING", "Withdrawal request");

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
      console.log(error);
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
      console.log("Latest wallet data", walletData);
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
    buyService
  };
};

export default useWallet;
