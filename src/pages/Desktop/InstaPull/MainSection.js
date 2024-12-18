import React, { useState } from "react";
import { Container, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

import NavbarComponent from "./Components/NavbarComponent";
import ProfileHeader from "./Components/ProfileHeader";
import PostsGrid from "./Components/PostsGrid";

function App() {
  // State to hold the profile data, loading status, and any error message
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Handle profile fetching
  const handleFetchProfile = async () => {
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    setError(null); // Reset error state
    setIsLoading(true); // Start loading

    try {
      // API call to the Google Cloud Function
      const response = await axios.get(
        `https://us-central1-startup-a54cf.cloudfunctions.net/InstaProfileFetcher/instagram-profile/${username}`
      );

      // If the response is successful, set the profile data
      if (response.data.success) {
        setProfile(response.data.profile);
      } else {
        setError(response.data.message || "No profile data found.");
      }
    } catch (err) {
      setError("Error fetching profile: " + err.message);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <>
      <Container className="mt-4">
        {/* Username Input Form */}
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Instagram Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Instagram username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading} // Disable input while loading
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleFetchProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Pulling...
              </>
            ) : (
              "Fetch Profile"
            )}
          </Button>
        </Form>

        {/* Error handling */}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        {/* Display profile if available */}
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <PostsGrid posts={profile.latestPosts || []} />
          </>
        )}
      </Container>
    </>
  );
}

export default App;
