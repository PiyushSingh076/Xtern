import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const useFetchOrganizationMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizationMembers = async (organizationId) => {

      try {
        // Fetch the organization document
        const orgDocRef = doc(db, "organization", organizationId);
        const orgDoc = await getDoc(orgDocRef);

        if (!orgDoc.exists()) {
          console.warn("No organization found with ID:", organizationId);
          setMembers([]);
          return;
        }

        const memberRefs = orgDoc.data().members;

        // Fetch each member's details using the references
        const membersData = await Promise.all(
          memberRefs.map(async (memberRef) => {
            const memberDoc = await getDoc(memberRef);
            if (memberDoc.exists()) {
              return { id: memberDoc.id, ...memberDoc.data() };
            }
            return null;
          })
        );

        setMembers(membersData.filter(Boolean)); // Filter out any null entries
      } catch (error) {
        console.error("Error fetching organization members:", error);
      } finally {
        setLoading(false);
      }
    };

    const getOrganizationIdAndFetchMembers = async (user) => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const organizationPath = userDoc.data().organization;
          const organizationId =
            organizationPath.id || organizationPath.split("/").pop();
          await fetchOrganizationMembers(organizationId);
        } else {
          console.warn("No user document found for UID:", user.uid);
          setMembers([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user organization ID:", error);
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getOrganizationIdAndFetchMembers(user);
      } else {
        setMembers([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { members, loading };
};

export default useFetchOrganizationMembers;
