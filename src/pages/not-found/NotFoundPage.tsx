import { useNavigate } from 'react-router-dom';
import { Ticket, ArrowLeft, Search } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">TickiTacka</h1>
          </div>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            {/* 404 Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-14 w-14 text-primary/40" />
                </div>
                <div className="absolute -top-1 -right-1 h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive font-bold text-sm">!</span>
                </div>
              </div>
            </div>

            {/* Error Text */}
            <div className="space-y-2">
              <h2 className="text-6xl font-bold text-primary">404</h2>
              <h3 className="text-xl font-semibold text-foreground">
                Page Not Found
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                The page you're looking for doesn't exist or has been moved to
                another location.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button
                className="w-full h-11"
                size="lg"
                onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Lost? Try navigating from the{' '}
          <button
            onClick={() => navigate('/')}
            className="text-secondary hover:underline cursor-pointer">
            homepage
          </button>
          .
        </p>
      </div>
    </div>
  );
}
