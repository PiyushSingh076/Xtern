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
  async function fetchNotifications(uid) {
    if (!uid) return;
    try {
      const q = query(
        collection(db, "notifications"),
        where("entrepreneurId", "==", uid), // Use "userId" for consistency
        where("type", "==", "SUBSCRIBED")
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
  async function acceptInvite(notificationId) {
    try {
        // Fetch the notification document
        const notificationDoc = await getDoc(doc(db, "notifications", notificationId));
        if (!notificationDoc.exists()) {
            throw new Error("Notification document does not exist");
        }

        const notificationData = notificationDoc.data();
        console.log("Notification Data:", notificationData);

        // Validate required fields
        if (!notificationData.entrepreneurId || !notificationData.userId) {
            throw new Error("Notification data is missing required fields");
        }

        // Update notification status and type to 'SUBSCRIBED'
        await updateDoc(doc(db, "notifications", notificationId), {
            status: "ACCEPTED",
            type: "SUBSCRIBED", // Set type to 'SUBSCRIBED'
        });

        // Add user to the entrepreneur's team
        const teamDocRef = doc(db, "teams", notificationData.entrepreneurId);
        const teamDoc = await getDoc(teamDocRef);

        if (!teamDoc.exists()) {
            console.log("Team does not exist, creating a new team");

            // If team doesn't exist, create a new team document
            await setDoc(teamDocRef, {
                entrepreneurId: notificationData.entrepreneurId,
                members: [
                    {
                        uid: notificationData.userId,
                        status: "SUBSCRIBED",  // Mark the user as subscribed
                    },
                ],
            });

            console.log("New team created and user added successfully");
        } else {
            // If team exists, add the user to the team
            const teamData = teamDoc.data();
            const members = teamData.members || [];

            // Check if the user is already in the team
            if (members.some((member) => member.uid === notificationData.userId)) {
                console.log("User is already a member of the team");
            } else {
                // Add the user to the team
                await updateDoc(teamDocRef, {
                    members: arrayUnion({
                        uid: notificationData.userId,
                        status: "SUBSCRIBED",  // Mark the user as subscribed
                    }),
                });

                console.log("User added to the team successfully");
            }
        }

        console.log("Invite accepted successfully");
    } catch (error) {
        console.error("Error accepting invite:", error);
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
  

  return { notifications, createNotification, acceptInvite, declineInvite,fetchNotifications };
}