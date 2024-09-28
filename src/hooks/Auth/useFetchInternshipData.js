import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the path as necessary

const useFetchInternshipData = (internshipId) => {
    const [internshipData, setInternshipData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInternshipData = async () => {
            try {
                const docRef = doc(db, "jobPosting", internshipId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setInternshipData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (internshipId) {
            fetchInternshipData();
        }
    }, [internshipId]);

    return { internshipData, loading, error };
};

export default useFetchInternshipData;
