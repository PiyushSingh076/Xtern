import React from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import OfflineBanner from "./OfflineBanner";

const AppWrapper = ({ children }) => {
  const isOnline = useOnlineStatus(); // Track online status
  const bannerHeight = 50; // Define the exact height of the banner

  return (
    <div style={styles.container(isOnline, bannerHeight)}>
      <OfflineBanner isOnline={isOnline} />
      {children} {/* Render the rest of the app */}
    </div>
  );
};

const styles = {
  container: (isOnline, bannerHeight) => ({
    marginTop: isOnline ? 0 : `${bannerHeight}px`, // Shift content exactly by the banner height
    transition: "margin-top 0.5s ease-in-out", // Smooth transition for content shift
    width: "100%", // Make sure the container takes full width
  }),
};

export default AppWrapper;
