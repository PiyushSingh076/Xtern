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
    } 
  };

  /**
   * Create a new Google Calendar event and store its details in Firestore
   * @param {Object} eventData - Data required to create and store the event
   */
  const createEvent = async (eventData) => {
    setLoading(true);
  
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
      attendees: eventData.attendees
        .filter((attendee) => attendee && attendee.email)
        .map((attendee) => ({ email: attendee.email })),
      conferenceData: {
        createRequest: {
          requestId: `call-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };
  
    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
      });
  
      const createdEvent = response.result;
      toast.success("Call scheduled successfully!");
  
      const scheduledCallsRef = collection(db, "scheduledCalls");
      await addDoc(scheduledCallsRef, {
        callId: `call-${Date.now()}`,
        callType: "video",
        createdAt: serverTimestamp(),
        eventId: createdEvent.id,
        eventLink: `https://calendar.google.com/calendar/event?eid=${createdEvent.id}`,
        hostUserId: eventData.hostUserId,
        hostUserRef: `/users/${eventData.hostUserId}`,
        meetLink: createdEvent.hangoutLink,
        recipientUserId: eventData.recipientUserId,
        recipientUserRef: `/users/${eventData.recipientUserId}`,
        scheduledDateTime: eventData.startDateTime,
      });

      return { success: true, eventLink: createdEvent.htmlLink };
    } catch (error) {
      toast.error("Error creating event.");
      console.error("Error creating event with Google Calendar:", error);
      return { success: false, error, eventLink: null };
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
