import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { db } from "../../firebaseConfig"; // Ensure the path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const useGoogleCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const CLIENT_ID =
    "876440760888-esjd63mvff2km3duo1p9gmg0mbu681tu.apps.googleusercontent.com";
  const API_KEY = "AIzaSyD1yJGRAttSxdMuQiGmkZ4kvSAn0nSZJFc";
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  /**
   * Initialize the Google API client for Calendar
   */
  const initClient = () => {
    console.log("Initializing Google Calendar API...");
    gapi.load("client:auth2", async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: SCOPES,
        });
        await gapi.client.load("calendar", "v3");

        const authInstance = gapi.auth2.getAuthInstance();
        setIsAuthenticated(authInstance.isSignedIn.get());
        setIsInitialized(true);
        console.log("Google Calendar API initialized successfully.");
      } catch (error) {
        console.error("Error initializing Google API client:", error);
        toast.error("Failed to initialize Google Calendar.");
      }
    });
  };

  /**
   * Sign in to the user's Google account if not already authenticated
   */
  const signIn = async () => {
    if (!isAuthenticated) {
      const authInstance = gapi.auth2.getAuthInstance();
      try {
        await authInstance.signIn();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    } else {
      console.log("User is already authenticated.");
    }
  };

  /**
   * Create a new Google Calendar event and store its details in Firestore
   * @param {Object} eventData - Data required to create and store the event
   */
  const createEvent = async (eventData) => {
    console.log("Attempting to create event with Google Meet:", eventData);
    setLoading(true);

    const event = {
      title: eventData.title,
      description: eventData.description,
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      attendees: eventData.attendees,
      hostUserId: eventData.hostUserId,
      recipientUserId: eventData.recipientUserId,
      callId: `call-${Date.now()}`,
      callType: "video",
    };

    try {
      // Send the event data to your backend API
      const response = await fetch(
        "http://localhost:5000/api/calendar/create-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const data = await response.json();
      console.log("Event creation response:", data);

      if (data.success) {
        toast.success("Call scheduled successfully!");

        // Save the event details to Firestore
        const scheduledCallsRef = collection(db, "scheduledCalls");
        await addDoc(scheduledCallsRef, {
          callId: event.callId,
          callType: event.callType,
          createdAt: serverTimestamp(),
          eventId: data.eventId,
          eventLink: data.eventLink,
          hostUserId: event.hostUserId,
          hostUserRef: `/users/${event.hostUserId}`,
          meetLink: data.meetLink,
          recipientUserId: event.recipientUserId,
          recipientUserRef: `/users/${event.recipientUserId}`,
          scheduledDateTime: event.startDateTime,
        });

        console.log("Event saved to Firestore.");
      } else {
        toast.error("Error creating event.");
        console.error("Error creating event:", data.error);
      }
    } catch (error) {
      toast.error("Error creating event.");
      console.error("Error creating event with backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { signIn, createEvent, loading, isInitialized };
};

export default useGoogleCalendar;
