import { onAuthStateChanged } from "firebase/auth";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { useAuth } from "../Auth/useAuth";
import toast from "react-hot-toast";
import { query } from "firebase/database";

export const useWallet = () => {
  const [wallet, setWallet] = useState();
  const [loaded, setLoaded] = useState(false);
  const { refresh } = useAuth();

  async function getTransactions(uid){
    const q = query(collection(db, "transactions"), where("walletId", "==", uid));
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map((doc) => doc.data());
    return transactions
  }

  async function createTransaction(uid, amount, type, description) {
    try {
        const transaction = await addDoc(collection(db, "transactions"), {
            walletId: uid,
            amount: amount,
            type: type,
            description: description,
            date: new Date()
          });
          await setDoc(
            doc(db, "wallet", uid),
            {
              transactions: arrayUnion(transaction.id),
            },
            { merge: true }
          );
    } catch (error) {
        toast.error("Error creating transaction")
    }
  }

  async function requestWithdraw(uid, amount) {
    try {
      const walletSnapshot = await getDoc(doc(db, "wallet", uid));
      if (walletSnapshot.exists()) {
        const walletData = walletSnapshot.data();
        if (walletData.amount >= amount) {
          // request code here
          toast.success("Withdrawal request sent successfully");
        } else {
          toast.error("Insufficient balance");
        }
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      toast.error("A error occurred, try again later.");
    }
  }


  async function debitWallet(uid, amount, description) {
    try {
      const transaction = await addDoc(collection(db, "transactions"), {
        walletId: uid,
        amount: amount,
        type: "DEBIT",
        description: description,
        date: new Date()
      }) 
      await setDoc(doc(db, "wallet", uid), {
        amount: increment(-amount),
        transactions: arrayUnion(transaction.id)
      },{merge: true})
      toast.success("Amount debited successfully")
    } catch (error) {
      console.log(error)
      toast.error("An error occurred")
    }
  }

  async function createWallet(uid) {
    await setDoc(doc(db, "wallet", uid), {
      amount: 0,
    });
  }

  async function getAmountInWallet(uid){
    const walletSnapshot = await getDoc(doc(db, "wallet", uid));
    if (walletSnapshot.exists()) {
      const walletData = walletSnapshot.data();
      console.log("Latest wallet data",walletData);
      return walletData.amount
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

  return { wallet, loaded, createTransaction, getTransactions, getAmountInWallet };
};

export default useWallet;
