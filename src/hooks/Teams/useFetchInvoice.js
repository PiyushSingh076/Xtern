import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

const useInvoicesWithInternData = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // Step 1: Get the currently logged-in user
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User is not logged in.");
        }

        // Step 2: Fetch the user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (!userSnapshot.exists()) {
          throw new Error("User data not found.");
        }

        const userData = userSnapshot.data();

        if (!userData.organization) {
          throw new Error(
            "Organization reference is missing in the user document."
          );
        }

        // Step 3: Query the invoice collection for matching organizationId
        const organizationRef = userData.organization;
        const invoiceCollection = collection(db, "invoice");
        const q = query(
          invoiceCollection,
          where("organizationId", "==", organizationRef)
        );
        const querySnapshot = await getDocs(q);

        // Step 4: Fetch invoice details and resolve intern references
        const invoicesWithInternData = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const invoice = { id: docSnapshot.id, ...docSnapshot.data() };

            if (invoice.details && Array.isArray(invoice.details)) {
              const detailsWithInternData = await Promise.all(
                invoice.details.map(async (detail) => {
                  if (detail.internRef) {
                    try {
                      // Fetch user data for the internRef
                      const internSnapshot = await getDoc(detail.internRef);

                      if (internSnapshot.exists()) {
                        const internData = internSnapshot.data();
                        return { ...detail, internData }; // Append internData to the detail object
                      } else {
                        return { ...detail, internData: null }; // Handle missing user document
                      }
                    } catch (fetchError) {
                      console.error(
                        `Error fetching intern data for ref: ${detail.internRef.path}`,
                        fetchError
                      );
                      return { ...detail, internData: null }; // Handle fetch error
                    }
                  }
                  return detail; // Return detail as is if internRef is missing or invalid
                })
              );

              return { ...invoice, details: detailsWithInternData }; // Append updated details to the invoice
            }

            return invoice;
          })
        );

        setInvoices(invoicesWithInternData);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return { invoices, loading, error };
};

export default useInvoicesWithInternData;
