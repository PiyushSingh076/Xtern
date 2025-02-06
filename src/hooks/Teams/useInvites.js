import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useNotifications } from "../useNotifications";
import { query } from "firebase/database";

export function useInvites() {
  const { createNotification } = useNotifications();

  async function checkInvited(uid, entrepreneurId) {
    const q = query(
      collection(db, "invites"),
      where("to", "==", uid),
      where("from", "==", entrepreneurId)
    );
    const querySnapshot = await getDocs(q);
    const invites = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    console.log("Invites",invites.length);
    if (invites.length > 0) {
      return true;
    }

    return false;
  }
  async function sendInvite(uid, entrepreneurId, shortlistDescription) {
    try {
      const entrepreneur = (
        await getDoc(doc(db, "users", entrepreneurId))
      ).data();

      const invite = await addDoc(collection(db, "invites"), {
        to: uid,
        from: entrepreneurId,
        description: shortlistDescription,
        status: "PENDING",
      });
      await createNotification(
        "INVITE",
        {
          inviteId: invite.id,
          teamName: entrepreneur.companyDetails.name,
          teamDescription: entrepreneur.companyDetails.description,
          teamLogo: entrepreneur.companyDetails.logo,
          from: entrepreneur.firstName + " " + entrepreneur.lastName,
          description: shortlistDescription
        },
        uid
      );
      toast.success("Invite sent successfully");
    } catch (error) {
      console.log("Error adding: ", error);
      toast.error("Error sending invite, try again");
    }
  }

  return { sendInvite, checkInvited };
}