import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
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
        console.log("User signed in successfully.");
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error("Failed to sign in to Google.");
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
    console.log("Attempting to create event:", eventData);
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

      // Create DocumentReferences for the host and recipient users
      const hostUserRef = doc(db, "users", eventData.hostUserId);
      const recipientUserRef = doc(db, "users", eventData.recipientUserId);

      // Save call details to Firestore
      const callData = {
        callId: eventData.callId,
        hostUserRef,
        recipientUserRef,
        hostUserId: eventData.hostUserId, // Add this field
        recipientUserId: eventData.recipientUserId, // Add this field
        scheduledDateTime: eventData.startDateTime,
        callType: eventData.callType,
        eventId,
        eventLink,
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
      setLoading(false);
    }
  };

  /**
   * Delete a Google Calendar event and remove its Firestore record
   * @param {string} eventId - ID of the Google Calendar event
   * @param {string} callDocId - Document ID of the associated Firestore record
   */
  const deleteEvent = async (eventId, callDocId) => {
    try {
      if (!isInitialized) {
        throw new Error("Google Calendar API not initialized.");
      }

      // Delete from Google Calendar
      const response = await gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });

      console.log("Google Calendar event deleted:", response);

      // Delete from Firestore
      await deleteDoc(doc(db, "scheduledCalls", callDocId));
      console.log("Firestore document deleted:", callDocId);

      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);

      // Handle specific error for already deleted events
      if (
        error.result &&
        error.result.error &&
        error.result.error.message === "Resource has been deleted"
      ) {
        toast.error("Event has already been deleted from Google Calendar.");
        // Optionally, delete the Firestore document since the event is already gone
        try {
          await deleteDoc(doc(db, "scheduledCalls", callDocId));
          toast.success(
            "Firestore record deleted as the event was already deleted."
          );
        } catch (firestoreError) {
          console.error("Error deleting Firestore document:", firestoreError);
          toast.error("Failed to delete the Firestore record.");
        }
      } else if (error.code === "permission_denied") {
        // Handle Firestore permission errors
        toast.error(
          "Insufficient permissions to delete the Firestore document."
        );
      } else {
        toast.error("Failed to delete the event.");
      }
    }
  };

  useEffect(() => {
    initClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { signIn, createEvent, deleteEvent, loading, isInitialized };
};

export default useGoogleCalendar;
