import {
  LucideIcon,
  Inbox,
  Search,
  FileQuestion,
  AlertCircle,
  Package
} from 'lucide-react';

import Button from './Button';
import { Card } from './Card';
import { cn } from './Utils';

type EmptyStateIconName = 'inbox' | 'search' | 'file' | 'alert' | 'package';
type EmptyStateVariant = 'default' | 'card';

type EmptyStateProps = {
  icon?: LucideIcon | EmptyStateIconName;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: EmptyStateVariant;
};

const iconMap: Record<EmptyStateIconName, LucideIcon> = {
  inbox: Inbox,
  search: Search,
  file: FileQuestion,
  alert: AlertCircle,
  package: Package
};

export default function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  secondaryAction,
  className,
  variant = 'default'
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

  const content = (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <IconComponent className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {description && (
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'card') {
    return (
      <Card data-slot="empty-state" className={cn('border-dashed', className)}>
        {content}
      </Card>
    );
  }

  return (
    <div data-slot="empty-state" className={className}>
      {content}
    </div>
  );
}

export type { EmptyStateProps, EmptyStateVariant, EmptyStateIconName };
