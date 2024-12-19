import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ensure the path is correct
import toast from "react-hot-toast";
const CLIENT_ID =
  "876440760888-esjd63mvff2km3duo1p9gmg0mbu681tu.apps.googleusercontent.com";
const API_KEY = "AIzaSyD1yJGRAttSxdMuQiGmkZ4kvSAn0nSZJFc";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const useGoogleCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const signIn = async () => {
    if (!isAuthenticated) {
      const authInstance = gapi.auth2.getAuthInstance();
      try {
        await authInstance.signIn();
        setIsAuthenticated(true);
        console.log("User signed in successfully.");
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error("Failed to sign in to Google.");
      }
    } else {
      console.log("User is already authenticated.");
    }
  };

  const createEvent = async (eventData) => {
    console.log("Attempting to create event:", eventData);
    setLoading(true); // Start loading
    const event = {
      summary: eventData.title,
      description: eventData.description,
      start: {
        dateTime: eventData.startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: eventData.attendees,
    };

    try {
      if (!isInitialized) {
        throw new Error("Google Calendar API is not initialized.");
      }

      if (!gapi.client.calendar) {
        throw new Error("Google Calendar API is not loaded.");
      }

      console.log("Creating event with data:", event);

      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      console.log("Event created successfully:", response);

      const eventId = response.result.id;
      const eventLink = response.result.htmlLink;

      // Save to Firestore
      const callData = {
        callId: eventData.callId,
        hostUserId: eventData.hostUserId,
        recipientUserId: eventData.recipientUserId,
        scheduledDateTime: eventData.startDateTime,
        callType: eventData.callType,
        eventId,
        eventLink, // Store the event link
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "scheduledCalls"), callData);

      toast.success("Call scheduled successfully!");
      return { success: true, eventId, eventLink };
    } catch (error) {
      toast.error("Error creating event.");
      console.error("Error creating event:", error);
      return { success: false, error };
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    initClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { signIn, createEvent, loading, isInitialized };
};

export default useGoogleCalendar;
