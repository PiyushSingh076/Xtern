import React from "react";

const OfflineBanner = ({ isOnline }) => {
  if (isOnline) return null; // Don't show the banner if online

  return <div style={styles.banner}>You are currently offline.</div>;
};

const styles = {
  banner: {
    position: "fixed", // Float over the content
    top: 0, // Stick to the top
    left: 0, // Align to the left to take full width
    right: 0, // Align to the right to take full width
    backgroundColor: "#ffcccb", // Light red background
    color: "#ff0000", // Red text
    textAlign: "center", // Center the text
    padding: "10px", // Padding for better visual appearance
    zIndex: 1000, // Ensure it's above other content
    width: "100%", // Take full width of the viewport
    fontWeight: "bold", // Make the text bold for readability
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for better visibility
  },
};

export default OfflineBanner;
