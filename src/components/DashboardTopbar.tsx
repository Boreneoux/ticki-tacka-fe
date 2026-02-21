import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

import useAuthStore from '@/stores/useAuthStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

type RouteTitle = {
  path: string;
  title: string;
  exact?: boolean;
};

const routeTitles: RouteTitle[] = [
  { path: '/dashboard', title: 'Dashboard Overview', exact: true },
  { path: '/dashboard/events/create', title: 'Create Event' },
  { path: '/dashboard/events', title: 'My Events' },
  { path: '/dashboard/transactions', title: 'Transactions' },
  { path: '/dashboard/statistics', title: 'Statistics' }
];

function getPageTitle(pathname: string): string {
  const exactMatch = routeTitles.find(r => r.exact && r.path === pathname);
  if (exactMatch) return exactMatch.title;

  const prefixMatch = routeTitles.find(
    r => !r.exact && pathname.startsWith(r.path)
  );
  return prefixMatch?.title || 'Dashboard';
}

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

type DashboardTopbarProps = {
  onToggleSidebar: () => void;
};

export default function DashboardTopbar({
  onToggleSidebar
}: DashboardTopbarProps) {
  const location = useLocation();
  const { fullName, profilePictureUrl } = useAuthStore();

  const pageTitle = getPageTitle(location.pathname);
  const firstName = fullName.split(' ')[0];
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden">
            <Menu className="size-5" />
          </Button>

          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Manage your events and track performance
            </p>
          </div>
        </div>

        {/* Right: greeting + avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">
              {greeting}, {firstName}! 👋
            </p>
            <p className="text-xs text-muted-foreground">Event Organizer</p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            {profilePictureUrl && (
              <AvatarImage src={profilePictureUrl} alt={fullName} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
