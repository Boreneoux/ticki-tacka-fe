import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Ticket,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import useAuthStore from '@/stores/useAuthStore';
import { logoutApi } from '@/features/login/api/logout.api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';

type SidebarNavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const navItems: SidebarNavItem[] = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: <LayoutDashboard className="size-5" />
  },
  {
    label: 'My Events',
    path: '/dashboard/events',
    icon: <CalendarDays className="size-5" />
  },
  {
    label: 'Transactions',
    path: '/dashboard/transactions',
    icon: <CreditCard className="size-5" />
  },
  {
    label: 'Statistics',
    path: '/dashboard/statistics',
    icon: <BarChart3 className="size-5" />
  }
];

const bottomNavItems: SidebarNavItem[] = [
  {
    label: 'Profile',
    path: '/profile',
    icon: <Settings className="size-5" />
  }
];

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

type DashboardSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  isOpen,
  onClose
}: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email, profilePictureUrl, resetAuth } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      resetAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to logout'
        : 'Failed to logout';
      toast.error(message);
      resetAuth();
      navigate('/login');
    }
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          md:sticky md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
        {/* Header: Logo + Close */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={handleNavClick}>
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
              TickiTacka
            </span>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-sidebar-primary/20">
              {profilePictureUrl && (
                <AvatarImage src={profilePictureUrl} alt={fullName} />
              )}
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </p>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive(item.path)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}>
              {item.icon}
              {item.label}
            </Link>
          ))}

          <div className="pt-4">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </p>
            {bottomNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                  }
                `}>
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <Link
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200">
            <Home className="size-5" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer">
            <LogOut className="size-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
