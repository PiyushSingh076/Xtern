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
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async (uid) => {
    try {
      // Fetch the user document from Firestore
      const userDocRef = doc(db, "users", uid);
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

      // Query the invoice collection for matching organizationId
      const organizationRef = userData.organization;
      const invoiceCollection = collection(db, "invoice");
      const q = query(
        invoiceCollection,
        where("organizationId", "==", organizationRef)
      );
      const querySnapshot = await getDocs(q);

      // Fetch invoice details and resolve intern references
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
    }
  };

  useEffect(() => {
    setLoading(true);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setError(null); // Reset error state
      setInvoices([]); // Reset invoices on auth state change

      if (user) {
        try {
          await fetchInvoices(user.uid);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // No user logged in
        setError("No user is logged in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const reloadInvoices = () => {
    const user = auth.currentUser;
    if (user) {
      setReloading(true);
      fetchInvoices(user.uid)
        .catch((err) => setError(err.message))
        .finally(() => setReloading(false));
    } else {
      setError("Cannot reload: No user is logged in.");
    }
  };

  return { invoices, loading, reloading, error, reloadInvoices };
};

export default useInvoicesWithInternData;
