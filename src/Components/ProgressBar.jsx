import {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  forwardRef,
} from "react";

const ProgressBar = forwardRef(function ProgressBar({ timer, onTimeout }, ref) {
  const [remainingTime, setRemainingTime] = useState(timer);
  const increment = 20;

  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - increment, 0));
    }, increment);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        setRemainingTime(timer);
        startInterval();
      },
    }),
    [startInterval, timer]
  );

  useEffect(() => {
    startInterval();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  useEffect(() => {
    if (remainingTime === 0) {
      clearInterval(intervalRef.current);
      onTimeout?.();
    }
  }, [remainingTime, onTimeout]);

  return (
    <progress
      ref={timerRef}
      id="progress-bar"
      value={remainingTime}
      max={timer}
    />
  );
});

export default ProgressBar;
