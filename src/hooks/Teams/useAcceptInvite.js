import { useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

const useAcceptInvite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const acceptInvite = async (inviteId) => {
    setLoading(true);
    setError(null);

    try {
      // Validate current user
      if (!auth.currentUser || !auth.currentUser.uid) {
        throw new Error("User is not authenticated.");
      }

      // Fetch the invite document
      const inviteDocRef = doc(db, "teamInvite", inviteId);
      const inviteDoc = await getDoc(inviteDocRef);
      if (!inviteDoc.exists()) {
        throw new Error("Invite not found.");
      }
      const inviteData = inviteDoc.data();

      // Validate required invite data
      if (!inviteData.organization || !inviteData.accessRole) {
        throw new Error(
          "Invite data is incomplete. Organization or access role is missing."
        );
      }

      // Update the user's document with the organization and accessRole
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        organization: inviteData.organization,
        accessRole: inviteData.accessRole, // Assign the role
      });

      // Update the organization document to include the user in the members array
      const organizationDocRef = doc(db, inviteData.organization.path); // Get the organization document reference
      await updateDoc(organizationDocRef, {
        members: arrayUnion(userDocRef), // Add the user reference to the members array
      });

      // Delete the invite document after acceptance
      await deleteDoc(inviteDocRef);
    } catch (err) {
      console.error("Error accepting invite:", err.message);
      setError(err.message || "Failed to accept invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { acceptInvite, loading, error };
};

export default useAcceptInvite;
