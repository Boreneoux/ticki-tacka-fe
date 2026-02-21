import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Settings,
  Receipt,
  LogOut,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import useAuthStore from '@/stores/useAuthStore';
import { logoutApi } from '@/features/login/api/logout.api';
import Button from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/DropdownMenu';

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const navigate = useNavigate();

  const { isLogin, role, fullName, email, profilePictureUrl, resetAuth } =
    useAuthStore();

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

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo — click to go home */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Ticket className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">
              TickiTacka
            </span>
          </Link>

          {/* Right Side: Auth */}
          <div className="flex items-center gap-2">
            {isLogin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                    <Avatar className="h-8 w-8">
                      {profilePictureUrl && (
                        <AvatarImage src={profilePictureUrl} alt={fullName} />
                      )}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium text-foreground">
                      {fullName.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === 'EO' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  {role === 'User' && (
                    <DropdownMenuItem asChild>
                      <Link to="/transactions" className="cursor-pointer">
                        <Receipt className="mr-2 h-4 w-4" />
                        My Transactions
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
