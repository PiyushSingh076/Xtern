import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";

const useFetchInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvites = async (phone, organizationRef) => {
      try {
        setLoading(true);

        const invitesQuery = query(
          collection(db, "teamInvite"),
          where("inviter", "==", phone),
          where("organization", "==", organizationRef)
        );

        const querySnapshot = await getDocs(invitesQuery);

        // Fetch detailed user information for each invite
        const invitesData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const inviteData = docSnapshot.data();
            const invitedPhone = inviteData.invited;
            console.log(invitedPhone, "sdf");
            // Fetch user details by invited phone number
            const usersQuery = query(
              collection(db, "users"),
              where("phone_number", "==", invitedPhone)
            );
            const userSnapshot = await getDocs(usersQuery);

            let invitedUserData = null;
            if (!userSnapshot.empty) {
              invitedUserData = {
                id: userSnapshot.docs[0].id,
                ...userSnapshot.docs[0].data(),
              };
            }

            return {
              id: docSnapshot.id,
              role: inviteData.role,
              createdAt: inviteData.createdAt,
              invitedUser: invitedUserData, // Save the user data here
            };
          })
        );

        setInvites(invitesData);
      } catch (err) {
        console.error("Error fetching invites:", err);
        setError("Failed to load invites.");
      } finally {
        setLoading(false);
      }
    };

    // Set up authentication listener to get current user's phone number and organization
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          fetchInvites(userData.phone_number, userData.organization);
        }
      } else {
        setInvites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { invites, loading, error };
};

export default useFetchInvites;
