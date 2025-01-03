import { updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useSubscriptions = (entrepreneurID) => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const entrepreneurRef = doc(db, "entrepreneurs", entrepreneurID);
        const entrepreneurSnapshot = await getDoc(entrepreneurRef);

        if (!entrepreneurSnapshot.exists()) {
          toast.error("Entrepreneur not found");
          throw new Error("Entrepreneur not found");
        }

        const entrepreneurData = entrepreneurSnapshot.data();
        setSubscriptions(entrepreneurData.subscriptions || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        toast.error("Error fetching subscriptions");
      }
    };
  });

  async function toggleSubscribeToExpert(xpertID) {
    const entrepreneurRef = doc(db, "entrepreneurs", entrepreneurID);
    const entrepreneurSnapshot = await getDoc(entrepreneurRef);

    if (!entrepreneurSnapshot.exists()) {
      toast.error("Entrepreneur not found");
      throw new Error("Entrepreneur not found");
    }

    const entrepreneurData = entrepreneurSnapshot.data();
    const existingSubscriptions = entrepreneurData.subscriptions || [];
    if (existingSubscriptions.includes(xpertID)) {
      const updatedSubscriptions = existingSubscriptions.filter(
        (id) => id !== xpertID
      );
      await updateDoc(entrepreneurRef, { subscriptions: updatedSubscriptions });
      toast.success("Unsubscribed from Xpert successfully!");
      return false;
    } else {
      const updatedSubscriptions = [...existingSubscriptions, xpertID];
      await updateDoc(entrepreneurRef, { subscriptions: updatedSubscriptions });
      toast.success("Subscribed to Xpert successfully!");
      return true;
    }
  }

  return { subscriptions, toggleSubscribeToExpert };
};
