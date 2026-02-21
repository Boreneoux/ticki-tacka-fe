import { Clock, AlertCircle } from 'lucide-react';

import { Card } from './Card';
import Badge from './Badge';
import { cn } from './Utils';
import { useCountdown } from '@/hooks/useCountdown';

type CountdownTimerVariant = 'default' | 'compact' | 'inline';

type CountdownTimerProps = {
  deadline: Date | string;
  onExpire?: () => void;
  variant?: CountdownTimerVariant;
  showIcon?: boolean;
  className?: string;
  warningThreshold?: number;
};

export default function CountdownTimer({
  deadline,
  onExpire,
  variant = 'default',
  showIcon = true,
  className,
  warningThreshold = 30
}: CountdownTimerProps) {
  const { timeLeft, isExpired, formatted, formatNumber } = useCountdown({
    deadline,
    onExpire
  });

  const totalMinutes =
    timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;
  const isWarning = totalMinutes <= warningThreshold && totalMinutes > 0;

  // Inline variant
  if (variant === 'inline') {
    return (
      <div
        data-slot="countdown-timer"
        className={cn('flex items-center gap-2', className)}>
        {showIcon && (
          <Clock
            className={cn(
              'h-4 w-4',
              isExpired
                ? 'text-destructive'
                : isWarning
                  ? 'text-yellow-600'
                  : 'text-muted-foreground'
            )}
          />
        )}
        <span
          className={cn(
            'font-mono text-sm',
            isExpired
              ? 'text-destructive'
              : isWarning
                ? 'text-yellow-600'
                : 'text-foreground'
          )}>
          {formatted}
        </span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <Badge
        data-slot="countdown-timer"
        variant={
          isExpired ? 'destructive' : isWarning ? 'outline' : 'secondary'
        }
        className={cn('font-mono', className)}>
        {showIcon && <Clock className="h-3 w-3 mr-1" />}
        {formatted}
      </Badge>
    );
  }

  // Default card variant
  return (
    <Card
      data-slot="countdown-timer"
      className={cn(
        'border-l-4',
        isExpired
          ? 'border-l-destructive bg-destructive/5'
          : isWarning
            ? 'border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/20'
            : 'border-l-primary bg-primary/5',
        className
      )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Clock
                className={cn(
                  'h-5 w-5',
                  isWarning ? 'text-yellow-600' : 'text-primary'
                )}
              />
            )}
            <span className="font-semibold">
              {isExpired ? 'Payment Expired' : 'Time Remaining'}
            </span>
          </div>
          {isWarning && !isExpired && (
            <Badge
              variant="outline"
              className="text-yellow-600 border-yellow-600">
              Hurry up!
            </Badge>
          )}
        </div>

        {isExpired ? (
          <p className="text-sm text-muted-foreground">
            The payment deadline has passed. This transaction will be
            automatically canceled.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {timeLeft.days > 0 && (
              <div className="text-center">
                <div className="bg-background rounded-lg p-3 border">
                  <div className="text-2xl font-bold font-mono">
                    {formatNumber(timeLeft.days)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase mt-1">
                    Days
                  </div>
                </div>
              </div>
            )}
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-2xl font-bold font-mono">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-xs text-muted-foreground uppercase mt-1">
                  Hours
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-2xl font-bold font-mono">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-xs text-muted-foreground uppercase mt-1">
                  Min
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-2xl font-bold font-mono">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-xs text-muted-foreground uppercase mt-1">
                  Sec
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export type { CountdownTimerProps, CountdownTimerVariant };
