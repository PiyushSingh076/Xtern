// src/hooks/Linkedin/useFetchLinkedInProfile.js
import { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

// Define your Firebase Cloud Function URL
const firebaseFunctionURL =
  "https://us-central1-startup-a54cf.cloudfunctions.net/fetchLinkedInProfileAndSaveExperiences";

const useFetchLinkedInProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkedInData, setLinkedInData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchLinkedInProfile = async (profileUrl) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage("");
      setLinkedInData(null); // Reset previous data

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("No authenticated user found. Please log in.");
        console.error("No authenticated user found.");
        return;
      }

      // Get Firebase ID token for the current user
      const idToken = await user.getIdToken();

      // Call Firebase Cloud Function
      const response = await axios.post(
        firebaseFunctionURL,
        { data: { profileUrl } },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );


      if (response.status === 200) {
        setSuccessMessage(
          response.data.message || "Profile fetched and saved successfully!"
        );
        setLinkedInData(response.data.linkedInData);
        return response.data;
      } else {
        setError(response.data.error || "Unexpected error occurred.");
        console.error("Unexpected response status:", response.status);
      }
    } catch (err) {
      console.error("Error fetching LinkedIn profile:", err);
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.error || "An unexpected error occurred.");
      } else if (err.request) {
        // Request was made but no response received
        setError("No response from server. Please try again later.");
      } else {
        // Something else happened
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchLinkedInProfile, loading, error, successMessage, linkedInData };
};

export default useFetchLinkedInProfile;

//------------------------------- Proper Structured Data  function---------------------

// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const axios = require('axios');

// // Initialize Firebase Admin SDK if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// exports.fetchLinkedInProfileAndSaveExperiences = functions
//   .region('us-central1')
//   .https.onRequest(async (req, res) => {
//     // Set CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//       return res.status(204).send('');
//     }

//     // Verify Firebase user session
//     const idToken = req.headers.authorization?.split('Bearer ')[1];
//     if (!idToken) {
//       return res.status(401).send({ error: 'Unauthorized: No Firebase ID token found.' });
//     }

//     try {
//       const decodedToken = await admin.auth().verifyIdToken(idToken);
//       const userUid = decodedToken.uid;

//       const { profileUrl } = req.body.data;

//       if (!profileUrl) {
//         return res.status(400).send({ error: 'Missing LinkedIn profile URL.' });
//       }

//       // Extract profile ID from LinkedIn URL
//       const profileId = profileUrl.match(/\/in\/([^/]+)/)?.[1];
//       if (!profileId) {
//         return res.status(400).send({ error: 'Invalid LinkedIn profile URL.' });
//       }

//       const linkedInApiUrl = `https://nubela.co/proxycurl/api/v2/linkedin?url=https://www.linkedin.com/in/${profileId}/`;

//       // Fetch LinkedIn profile data
//       const response = await axios.get(linkedInApiUrl, {
//         headers: {
//           Authorization: `Bearer UXy_wyHdFIvlS4D6uBHMKw`,
//         },
//       });

//       const linkedInData = response.data;

//       // Normalize the data
//       const normalizedData = {
//         profile: {
//           fullName: linkedInData.full_name || '',
//           headline: linkedInData.headline || '',
//           location: {
//             city: linkedInData.city || '',
//             state: linkedInData.state || '',
//             country: linkedInData.country || '',
//           },
//           profilePicture: linkedInData.profile_pic_url || '',
//           backgroundImage: linkedInData.background_cover_image_url || '',
//           summary: linkedInData.summary || '',
//           connections: linkedInData.connections || linkedInData.follower_count || 0,
//         },
//         experiences: (linkedInData.experiences || []).map((exp) => ({
//           company: exp.company || '',
//           title: exp.title || '',
//           description: exp.description || '',
//           location: exp.location || '',
//           startDate: exp.starts_at
//             ? new Date(exp.starts_at.year, exp.starts_at.month - 1, exp.starts_at.day)
//             : null,
//           endDate: exp.ends_at
//             ? new Date(exp.ends_at.year, exp.ends_at.month - 1, exp.ends_at.day)
//             : null,
//         })),
//         education: (linkedInData.education || []).map((edu) => ({
//           school: edu.school || '',
//           degree: edu.degree_name || '',
//           fieldOfStudy: edu.field_of_study || '',
//           startDate: edu.starts_at
//             ? new Date(edu.starts_at.year, edu.starts_at.month - 1, edu.starts_at.day)
//             : null,
//           endDate: edu.ends_at
//             ? new Date(edu.ends_at.year, edu.ends_at.month - 1, edu.ends_at.day)
//             : null,
//           grade: edu.grade || '',
//         })),
//         certifications: (linkedInData.certifications || []).map((cert) => ({
//           name: cert.name || '',
//           authority: cert.authority || '',
//           url: cert.url || '',
//           startDate: cert.starts_at
//             ? new Date(cert.starts_at.year, cert.starts_at.month - 1, cert.starts_at.day)
//             : null,
//           endDate: cert.ends_at
//             ? new Date(cert.ends_at.year, cert.ends_at.month - 1, cert.ends_at.day)
//             : null,
//         })),
//       };

//       // Save experiences to Firestore
//       const batch = admin.firestore().batch();
//       const userRef = admin.firestore().collection('users').doc(userUid);

//       normalizedData.experiences.forEach((experience) => {
//         const workerDocRef = admin.firestore().collection('worker').doc();
//         batch.set(workerDocRef, { ...experience, work: userRef });
//       });

//       await batch.commit();

//       // Send the normalized data back to the client
//       res.status(200).send({
//         message: 'Profile fetched and experiences saved successfully.',
//         data: normalizedData,
//       });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send({ error: error.message || 'Internal server error.' });
//     }
//   });
