import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { collection, doc, where, getDocs, getDoc, query } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const useFetchInvoice = () => {

    const [loading, setLoading] = useState(true)
    const [paymentData, setPaymentData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async (organizationId) => {
            if (!organizationId) return;

            try {
                const invoicesRef = collection(db, 'invoice');
                const q = query(invoicesRef, where('organizationId', '==', organizationId));
                const invoiceSnapshot = await getDocs(q);

                const invoices = await Promise.all(
                    invoiceSnapshot.docs.map(async (doc) => {
                        const invoice = doc.data();
                        const internRef = doc(invoice.internRef);
                        const internDoc = await getDoc(internRef);

                        const internName = internDoc.exists() ? internDoc.data().name : 'Unknown Intern';

                        return {
                            month: invoice.month,
                            totalAmount: invoice.totalAmount,
                            paymentSummary: invoice.details.map(detail => ({
                                name: internName,
                                amount: detail.salary,
                            })),
                            status: invoice.status,
                            paymentLink: invoice.payLink
                        };
                    })
                );

                setPaymentData(invoices);
            } catch (error) {
                console.error("Error fetching payment data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        const getOrganizationIdAndFetchInvoices = async (user) => {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const organizationPath = userDoc.data().organization;
                    const organizationId =
                        organizationPath.id || organizationPath.split("/").pop();
                    await fetchInvoices(organizationId);
                } else {
                    console.warn("No user document found for UID:", user.uid);
                    setPaymentData([]);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user organization ID:", error);
                setLoading(false);
            }
        };

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            getOrganizationIdAndFetchInvoices(user);
            fetchInvoices();
        } else {
            console.warn("No user is currently signed in.");
            setLoading(false);
        }

    }, [])

    return { loading, paymentData, error };
}

export default useFetchInvoice