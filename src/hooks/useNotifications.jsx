import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  getDocs,
  getDoc,
  arrayUnion,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { InventoryTwoTone } from "@mui/icons-material";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  async function fetchInvites(uid) {
    if (!uid) return;
    const q = query(
      collection(db, "notifications"),
      where("uid", "==", uid),
      where("type", "==", "INVITE")
    );
    const invites = await getDocs(q);
    const inviteData = invites.docs.map((doc) => {
      return { ...doc.data() };
    });
    console.log("InviteData", inviteData);
    return inviteData;
  }

  async function createNotification(type,item, uid) {
    console.log(item, uid )
    await addDoc(collection(db, "notifications"), {
      data: item,
      opened: false,
      uid,
      type: type,
    });
  }

  async function acceptInvite(id, notification) {
    const invite = await getDoc(doc(db, "invites", id));
    const inviteData = invite.data();
    console.log(inviteData)
    await setDoc(doc(db, "notifications", notification), { status: "ACCEPTED" }, {merge: true});
    await setDoc(doc(db, "invites", id), { status: "ACCEPTED" }, {merge: true});
    await setDoc(doc(db, "teams", inviteData.from), {
      members: arrayUnion({
        uid: inviteData.to,
        status: "SHORTLIST",
      }),
    }, {merge: true});

    // await deleteDoc(doc(db, "invites", id))
  }

  async function declineInvite(id) {
    await updateDoc(doc(db, "notifications", id), { status: "declined" });
  }

  return { notifications, createNotification, acceptInvite, declineInvite };
}
