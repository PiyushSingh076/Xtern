import { useState, useEffect, useCallback } from "react";

export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    const isMobileView = width < 768; // Fixed number comparison

    // 420 is for mobile view, width changes in height for mobile
    return {
      width: isMobileView ? height : width, // Adjust this logic based on your needs
      height,
      isMobileView,
    };
  }, [hasWindow]);

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow, getWindowDimensions]);

  return windowDimensions;
}
