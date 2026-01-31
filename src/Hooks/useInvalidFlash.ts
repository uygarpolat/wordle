import { useCallback, useEffect, useRef } from "react";

const FLASH_DURATION_MS = 750;

const useInvalidFlash = () => {
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerInvalidFlash = useCallback(() => {
    document.body.classList.add("bg-flash-red");
    if (flashTimeoutRef.current) {
      clearTimeout(flashTimeoutRef.current);
    }
    flashTimeoutRef.current = setTimeout(() => {
      document.body.classList.remove("bg-flash-red");
      flashTimeoutRef.current = null;
    }, FLASH_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }
      document.body.classList.remove("bg-flash-red");
    };
  }, []);

  return { triggerInvalidFlash };
};

export default useInvalidFlash;
