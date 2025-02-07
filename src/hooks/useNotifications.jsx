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
      // Fetch entrepreneur details
      const entrepreneurRef = doc(db, "users", data.entrepreneurId);
      const entrepreneurSnap = await getDoc(entrepreneurRef);
      
      if (!entrepreneurSnap.exists()) {
        throw new Error("Entrepreneur details not found");
      }
  
      const entrepreneurData = entrepreneurSnap.data();
  
      await addDoc(collection(db, "notifications"), {
        type,
        userId,
        entrepreneurId: data.entrepreneurId,
        entrepreneurName: entrepreneurData.display_name || "Unknown",
        entrepreneurFirstName: entrepreneurData.firstName || "",
        entrepreneurLastName: entrepreneurData.lastName || "",
        entrepreneurEmail: entrepreneurData.email || "",
        stipend: data.stipend,
        description: data.description,
        status: "UNREAD",
        createdAt: Timestamp.now(),
      });
  
      console.log("Notification created successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  }
  
  async function acceptInvite(inviteId, notificationId) {
    try {
      // Fetch the invite document
      const inviteDoc = await getDoc(doc(db, "notifications", notificationId));
      if (!inviteDoc.exists()) {
        throw new Error("Invite document does not exist");
      }
  
      const inviteData = inviteDoc.data();
      console.log("Invite Data:", inviteData);
  
      // Validate required fields
      if (!inviteData.entrepreneurId || !inviteData.userId) {
        throw new Error("Invite data is missing required fields");
      }
  
      await updateDoc(doc(db, "notifications", notificationId), {
        status: "ACCEPTED",
      });
  
      await updateDoc(doc(db, "invites", inviteId), {
        status: "ACCEPTED",
      });
  
      
      const teamDocRef = doc(db, "teams", inviteData.entrepreneurId);
      const teamDoc = await getDoc(teamDocRef);
  
      if (!teamDoc.exists()) {
        throw new Error("Team does not exist");
      }
  
      const teamData = teamDoc.data();
      const members = teamData.members || []; // Ensure members is an array, even if undefined
  
      // Check if the user is already in the team
      if (members.some((member) => member.uid === inviteData.userId)) {
        console.log("User is already a member of the team");
      } else {
        // Add the user to the team
        await updateDoc(teamDocRef, {
          members: arrayUnion({
            uid: inviteData.userId,
            status: "SHORTLIST", // Adjust status if needed
          }),
        });
  
        console.log("User added to the team successfully");
      }
  
      console.log("Invite accepted successfully");
    } catch (error) {
      console.error("Error accepting invite:", error);
      throw error; 
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