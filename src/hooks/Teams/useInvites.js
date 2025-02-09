import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from "react-hot-toast";
import { useNotifications } from "../useNotifications";

export function useInvites() {
  const { createNotification } = useNotifications();

  async function checkInvited(uid, entrepreneurId) {
    const q = query(
      collection(db, "invites"),
      where("to", "==", uid),
      where("from", "==", entrepreneurId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0; // Return true if invite exists
  }

  async function sendInvite(uid, entrepreneurId, shortlistDescription) {
    try {
      const alreadyInvited = await checkInvited(uid, entrepreneurId);
      if (alreadyInvited) {
        toast.error("User is already shortlisted");
        return;
      }

      const entrepreneurDoc = await getDoc(doc(db, "users", entrepreneurId));
      if (!entrepreneurDoc.exists()) {
        throw new Error("Entrepreneur not found");
      }
      const entrepreneur = entrepreneurDoc.data();

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
          name : invite.name,
          teamName: entrepreneur.companyDetails?.name || "Unknown",
          teamDescription: entrepreneur.companyDetails?.description || "No description",
          teamLogo: entrepreneur.companyDetails?.logo || "",
          from: `${entrepreneur.firstName} ${entrepreneur.lastName}`,
          description: shortlistDescription
        },
        uid
      );

      toast.success("Invite sent successfully");
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Error sending invite, try again");
    }
  }

  async function fetchShortlistedUsers(entrepreneurId) {
    try {
      const q = query(
        collection(db, "invites"),
        where("from", "==", entrepreneurId),
        where("status", "==", "PENDING")
      );
      const querySnapshot = await getDocs(q);

      const users = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const inviteData = docSnap.data();
          const userDoc = await getDoc(doc(db, "users", inviteData.to));
          return userDoc.exists()
            ? { id: userDoc.id, ...userDoc.data() }
            : null;
        })
      );

      return users.filter((user) => user !== null);
    } catch (error) {
      console.error("Error fetching shortlisted users:", error);
      return [];
    }
  }

  return { sendInvite, checkInvited, fetchShortlistedUsers };
}
