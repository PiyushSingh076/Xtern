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
import { Timestamp } from "firebase/firestore";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications for a specific user
  async function fetchInvites(uid) {
    if (!uid) return;
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", uid), // Use "userId" for consistency
        where("type", "==", "SUBSCRIPTION")
      );
      const invites = await getDocs(q);
      const inviteData = invites.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log("InviteData", inviteData);
      return inviteData;
    } catch (error) {
      console.error("Error fetching invites:", error);
      return [];
    }
  }

  // Create a new notification
  async function createNotification(type, data, userId) {
    try {
      const notificationRef = await addDoc(collection(db, "notifications"), {
        type: type,
        data: data,
        userId: userId,
        status: "UNREAD",
        createdAt: Timestamp.now(),
      });
      console.log("Notification sent successfully:", notificationRef.id);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  // Accept an invite and update related documents
  async function acceptInvite(inviteId, notificationId) {
    try {
      // Fetch the invite document
      const inviteDoc = await getDoc(doc(db, "invites", inviteId));
      if (!inviteDoc.exists()) {
        throw new Error("Invite document does not exist");
      }

      const inviteData = inviteDoc.data();
      console.log("Invite Data:", inviteData);

      // Validate required fields
      if (!inviteData.from || !inviteData.to) {
        throw new Error("Invite data is missing required fields");
      }

      // Update notification status to "ACCEPTED"
      await updateDoc(doc(db, "notifications", notificationId), {
        status: "ACCEPTED",
      });

      // Update invite status to "ACCEPTED"
      await updateDoc(doc(db, "invites", inviteId), {
        status: "ACCEPTED",
      });

      // Add the user to the team's members array
      const teamDocRef = doc(db, "teams", inviteData.from);
      await updateDoc(teamDocRef, {
        members: arrayUnion({
          uid: inviteData.to,
          status: "SHORTLIST",
        }),
      });

      console.log("Invite accepted successfully");
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error; // Re-throw the error for handling in the UI
    }
  }

  // Decline an invite
  async function declineInvite(id) {
    try {
      await updateDoc(doc(db, "notifications", id), { status: "DECLINED" });
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  }

  return { notifications, createNotification, acceptInvite, declineInvite };
}