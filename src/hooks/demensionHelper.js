import { useState, useEffect, useCallback } from "react";

export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  const getWindowDimensions = useCallback(() => {
    const width = window.innerWidth;
   
    const isMobileView = ¸ width < '768';

    console.log('isMobileView demensionHelper: ',isMobileView);

    return {
      width,

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
