import { useEffect, useState } from "react";
import { collection, query, where, updateDoc, doc, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { InventoryTwoTone } from "@mui/icons-material";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  async function fetchInvites(uid) {
    if (!uid) return;
    const q = query(collection(db, "notifications"), where("uid", "==", uid), where("type", "==", "INVITE"));
    const invites =await getDocs(q);
    const inviteData= invites.docs.map((doc)=>{
      return {...doc.data()};
    })
    console.log("InviteData",inviteData);
    return inviteData;
  };

  async function createNotification(item, uid) {
    await addDoc(collection(db, "notifications"), {
      data: item,
      opened: false,
      uid,
      type: "INVITE",
    });
  }

  async function acceptInvite(id) {
    await updateDoc(doc(db, "notifications", id), { status: "accepted" });
  }

  async function declineInvite(id) {
    await updateDoc(doc(db, "notifications", id), { status: "declined" });
  }

  return { notifications, createNotification, acceptInvite, declineInvite };
}
