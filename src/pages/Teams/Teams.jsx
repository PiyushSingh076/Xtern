import React, { useState, useEffect } from "react";
import Shortlisted from "./Shortlisted";
import Xtern from "./Xtern";
import Colleagues from "./Colleagues";
import Payments from "./Payments";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export default function Teams() {
  const { options } = useParams();
  const navigate = useNavigate();

  const [index, setIndex] = useState(
    options === "shortlisted"
      ? 0
      : options === "xtern"
      ? 1
      : options === "colleagues"
      ? 2
      : options === "payments"
      ? 3
      : 0
  );

  const [userAccessRole, setUserAccessRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Ensure the auth.currentUser is ready
        if (!auth.currentUser) {
          throw new Error("User is not authenticated.");
        }

        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const role = userDoc.data().accessRole;
          if (!role) {
            throw new Error("Access role is missing in user document.");
          }
          setUserAccessRole(role);
        } else {
          throw new Error("User document not found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching user role:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Wait for Firebase Auth to initialize before fetching the user role
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserRole();
      } else {
        setLoading(false); // Stop loading if no user is logged in
        setError("User is not authenticated.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  useEffect(() => {
    const paths = ["shortlisted", "xtern", "colleagues", "payments"];
    navigate(`/teams/${paths[index]}`, { replace: true });
  }, [index, navigate]);

  // Show a loading spinner while the role is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle errors gracefully
  if (error) {
    return (
      <div className="teams-container">
        <div className="error-state">
          <p>An error occurred: {error}</p>
          <button
            onClick={() => {
              auth.signOut();
              navigate("/", { replace: true });
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-container">
      {/* Main content */}
      <section>
        <div className="container">
          {/* Navigation tabs */}
          <ul className="nav-tabs-container" id="mentor-tab" role="tablist">
            {userAccessRole === "management" && (
              <>
                <li
                  className={`nav-items ${index === 0 ? "active" : ""}`}
                  role="presentation"
                >
                  <button
                    onClick={() => setIndex(0)}
                    className={`nav-link-btn ${index === 0 ? "active" : ""}`}
                    id="mentor-course-tab-btn"
                    type="button"
                    role="tab"
                    aria-controls="course-content"
                    aria-selected={index === 0}
                  >
                    ShortListed
                  </button>
                </li>
                {/* Xtern tab */}
                <li
                  className={`nav-items ${index === 1 ? "active" : ""}`}
                  role="presentation"
                >
                  <button
                    onClick={() => setIndex(1)}
                    className={`nav-link-btn ${index === 1 ? "active" : ""}`}
                    id="student-tab-btn"
                    type="button"
                    role="tab"
                    aria-controls="student-content"
                    aria-selected={index === 1}
                  >
                    Xtern
                  </button>
                </li>
              </>
            )}
            {/* ShortListed tab */}

            {/* Colleagues tab */}
            <li
              className={`nav-items ${index === 2 ? "active" : ""}`}
              role="presentation"
            >
              <button
                onClick={() => setIndex(2)}
                className={`nav-link-btn ${index === 2 ? "active" : ""}`}
                id="reviews-tab-btn"
                type="button"
                role="tab"
                aria-controls="reviews-content"
                aria-selected={index === 2}
              >
                Colleagues
              </button>
            </li>
            {/* Payments tab (Visible only to 'management' users) */}
            {userAccessRole === "management" && (
              <li
                className={`nav-items ${index === 3 ? "active" : ""}`}
                role="presentation"
              >
                <button
                  onClick={() => setIndex(3)}
                  className={`nav-link-btn ${index === 3 ? "active" : ""}`}
                  id="payments-tab-btn"
                  type="button"
                  role="tab"
                  aria-controls="payments-content"
                  aria-selected={index === 3}
                >
                  Payments
                </button>
              </li>
            )}
          </ul>

          {/* Tab content */}
          <div className="tab-content">
            {/* ShortListed tab */}
            <div
              className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
              id="course-content"
              role="tabpanel"
              aria-labelledby="mentor-course-tab-btn"
            >
              <Shortlisted />
            </div>

            {/* Xtern tab */}
            <div
              className={`tab-pane fade ${index === 1 ? "show active" : ""}`}
              id="student-content"
              role="tabpanel"
              aria-labelledby="student-tab-btn"
            >
              <Xtern userAccessRole={userAccessRole} />
            </div>

            {/* Colleagues tab */}
            <div
              className={`tab-pane fade ${index === 2 ? "show active" : ""}`}
              id="reviews-content"
              role="tabpanel"
              aria-labelledby="reviews-tab-btn"
            >
              <Colleagues userAccessRole={userAccessRole} />
            </div>

            {/* Payments tab */}
            {userAccessRole === "management" && (
              <div
                className={`tab-pane fade ${index === 3 ? "show active" : ""}`}
                id="payments-content"
                role="tabpanel"
                aria-labelledby="payments-tab-btn"
              >
                <Payments />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
