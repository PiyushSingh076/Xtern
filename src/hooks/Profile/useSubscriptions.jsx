import { arrayRemove, arrayUnion, doc, getDoc, updateDoc, runTransaction } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useState } from "react";

export const useSubscriptions = () => {
    const [loading, setLoading] = useState(false)

    async function isSubscribed(xpertId) {
        setLoading(true)
      const entrepreneurId = auth.currentUser.uid;

      const entrepreneurDocRef = doc(db, "users", entrepreneurId);
      const entrepreneurDoc = await getDoc(entrepreneurDocRef);
      const subs = entrepreneurDoc.data().subs || [];
      setLoading(false)
      return subs.includes(xpertId);
    }

  async function toggleSubscribeToXpert(xpertId) {
    try {
      const entrepreneurId = auth.currentUser.uid;

      return await runTransaction(db, async (transaction) => {
        setLoading(true)
        const entrepreneurDocRef = doc(db, "users", entrepreneurId);
        const xpertDocRef = doc(db, "users", xpertId);
        
        const entrepreneurDoc = await transaction.get(entrepreneurDocRef);
        if (!entrepreneurDoc.exists()) {
          throw new Error("Entrepreneur data not found");
        }

        const subs = entrepreneurDoc.data().subs || [];

        if (subs.includes(xpertId)) {
          transaction.update(entrepreneurDocRef, {
            subs: arrayRemove(xpertId),
          });

          transaction.update(xpertDocRef, {
            subs: arrayRemove(entrepreneurId),
          });

          toast.success("Unsubscribed successfully!");
          setLoading(false)
          return false;
        } else {
          transaction.update(entrepreneurDocRef, {
            subs: arrayUnion(xpertId),
          });

          transaction.update(xpertDocRef, {
            subs: arrayUnion(entrepreneurId),
          });

          toast.success("Subscribed successfully!");
          setLoading(false)
          return true;
        }
      });
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(`Failed to subscribe. ${error.message || "Please try again."}`);
    }
  }

  return { toggleSubscribeToXpert, isSubscribed, subLoading: loading };
};
