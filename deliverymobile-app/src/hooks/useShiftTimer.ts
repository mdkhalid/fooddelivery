import { useState, useEffect, useRef, useCallback } from 'react';

export const useShiftTimer = () => {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [shiftDuration, setShiftDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startShift = useCallback(() => {
    setIsShiftActive(true);
    setShiftDuration(0);
    intervalRef.current = setInterval(() => {
      setShiftDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const endShift = useCallback(() => {
    setIsShiftActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { isShiftActive, shiftDuration, formattedDuration: formatDuration(shiftDuration), startShift, endShift };
};