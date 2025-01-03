import { collection, getDoc, getDocs, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import toast from "react-hot-toast";
import { useState } from "react";
export const useFetchJob = ({id}) => {
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleFetchJob = async () => {
            setLoading(true);
            const data = await fetchJob();
            setJobDetails(data);
            setLoading(false);

        }
        handleFetchJob();
    }, [id])

    async function fetchJob() {
        const jobSnapshot = await getDoc(doc(db, "jobs", id));
        if(!jobSnapshot.exists()) {
            toast.error("Job not found");
            throw new Error("Job not found");
        }
        const data = jobSnapshot.data();
        delete data["applicants"];
        return data;
    }

    async function fetchApplicantDetails() {
        const job = (await getDoc(doc(db, "jobs", id))).data();

        const applicants = job.applicants;

        return applicants;
        
    }

    return { jobDetails, loading, fetchApplicantDetails };
}