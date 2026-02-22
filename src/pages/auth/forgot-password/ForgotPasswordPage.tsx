import { Link } from 'react-router-dom';
import { Ticket, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card';
import Label from '@/components/ui/Label';
import useFormForgotPassword from '@/features/forgot-password/hooks/useFormForgotPassword';

export default function ForgotPasswordPage() {
  const { formik, isSubmitted } = useFormForgotPassword();

  const isFieldError = formik.touched.email && formik.errors.email;

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
          <p className="text-muted-foreground">
            Reset your password in a few easy steps
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          {isSubmitted ? (
            <>
              <CardHeader className="space-y-1 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription className="text-base">
                  If an account with that email exists, a password reset link
                  has been sent. Please check your inbox and spam folder.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    The link will expire in 15 minutes.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    asChild>
                    <Link to="/login">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset
                  your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="pl-10"
                        aria-invalid={isFieldError ? true : undefined}
                      />
                    </div>
                    {isFieldError && (
                      <p className="text-sm text-destructive">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11"
                    size="lg"
                    disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending reset link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-card text-muted-foreground">
                        Remember your password?
                      </span>
                    </div>
                  </div>

                  {/* Back to Login */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    asChild>
                    <Link to="/login">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-secondary hover:underline">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
