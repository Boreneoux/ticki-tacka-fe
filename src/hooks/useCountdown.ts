import { useState, useEffect, useCallback, useRef } from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

type UseCountdownOptions = {
  deadline: Date | string;
  onExpire?: () => void;
  intervalMs?: number;
};

type UseCountdownReturn = {
  timeLeft: TimeLeft;
  isExpired: boolean;
  formatted: string;
  formatNumber: (num: number) => string;
};

function useCountdown({
  deadline,
  onExpire,
  intervalMs = 1000
}: UseCountdownOptions): UseCountdownReturn {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const deadlineTime =
      typeof deadline === 'string' ? new Date(deadline) : deadline;
    const now = new Date();
    const diff = deadlineTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      total: diff
    };
  }, [deadline]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft());
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);
  const hasFiredRef = useRef(false);

  const isExpired = timeLeft.total <= 0;

  useEffect(() => {
    if (isExpired && !hasFiredRef.current) {
      hasFiredRef.current = true;
      onExpireRef.current?.();
    }

    if (!isExpired) {
      hasFiredRef.current = false;
    }
  }, [isExpired]);

  useEffect(() => {
    if (isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isExpired, intervalMs, calculateTimeLeft]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const formatted = isExpired
    ? 'Expired'
    : timeLeft.days > 0
      ? `${timeLeft.days}d ${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`
      : `${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`;

  return { timeLeft, isExpired, formatted, formatNumber };
}

export { useCountdown };
export type { TimeLeft, UseCountdownOptions, UseCountdownReturn };
