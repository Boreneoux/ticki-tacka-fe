import * as React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './AlertDialog';
import { cn } from './Utils';

type ConfirmDialogVariant =
  | 'default'
  | 'destructive'
  | 'warning'
  | 'info'
  | 'success';

type ConfirmDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

const variantConfig: Record<
  ConfirmDialogVariant,
  {
    icon: React.ElementType;
    iconClass: string;
    bgClass: string;
    buttonVariant: 'default' | 'destructive';
  }
> = {
  default: {
    icon: AlertCircle,
    iconClass: 'text-primary',
    bgClass: 'bg-primary/10',
    buttonVariant: 'default'
  },
  destructive: {
    icon: X,
    iconClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    buttonVariant: 'destructive'
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-600',
    bgClass: 'bg-yellow-100 dark:bg-yellow-950/30',
    buttonVariant: 'default'
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-100 dark:bg-blue-950/30',
    buttonVariant: 'default'
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-600',
    bgClass: 'bg-green-100 dark:bg-green-950/30',
    buttonVariant: 'default'
  }
};

export default function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  disabled = false,
  children
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const config = variantConfig[variant];
  const Icon = config.icon;

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
      handleOpenChange(false);
    } catch {
      // Keep dialog open on error
    }
  };

  const handleCancel = () => {
    onCancel?.();
    handleOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                config.bgClass
              )}>
              <Icon className={cn('h-5 w-5', config.iconClass)} />
            </div>

            <div className="flex-1">
              <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
              {description && (
                <AlertDialogDescription className="text-left mt-2">
                  {description}
                </AlertDialogDescription>
              )}
            </div>
          </div>
        </AlertDialogHeader>

        {children && <div className="py-4">{children}</div>}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            variant={config.buttonVariant}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export type { ConfirmDialogProps, ConfirmDialogVariant };
