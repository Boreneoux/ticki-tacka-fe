import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Browse Events', path: '/events' },
  { label: 'Categories', path: '/categories' }
];

const accountLinks = [
  { label: 'Sign In', path: '/login' },
  { label: 'Sign Up', path: '/register' },
  { label: 'My Profile', path: '/profile' },
  { label: 'My Transactions', path: '/transactions' }
];

const supportLinks = [
  { label: 'Help Center', href: '#' },
  { label: 'Contact Us', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' }
];

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">
                TickiTacka
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Powering Every Event Experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              {accountLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} TickiTacka. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
