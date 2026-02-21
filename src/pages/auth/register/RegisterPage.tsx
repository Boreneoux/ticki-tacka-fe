import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Ticket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building,
  MapPin,
  Tag
} from 'lucide-react';

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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Textarea from '@/components/ui/Textarea';
import useFormRegister from '@/features/register/hooks/useFormRegister';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { formik } = useFormRegister();
  const [showPassword, setShowPassword] = useState(false);

  const isFieldError = (field: string) =>
    formik.touched[field as keyof typeof formik.touched] &&
    formik.errors[field as keyof typeof formik.errors];

  const getFieldError = (field: string) =>
    formik.errors[field as keyof typeof formik.errors];

  const handleRoleChange = (value: string) => {
    formik.setFieldValue('role', value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-secondary/10 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">TickiTacka</h1>
          </div>
          <p className="text-muted-foreground">
            Create your account and start booking amazing events
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Choose your account type and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selector */}
            <Tabs
              value={formik.values.role}
              onValueChange={handleRoleChange}
              className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="User">Customer</TabsTrigger>
                <TabsTrigger value="EO">Event Organizer</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
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
                      aria-invalid={isFieldError('email') ? true : undefined}
                    />
                  </div>
                  {isFieldError('email') && (
                    <p className="text-sm text-destructive">
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-10"
                      aria-invalid={isFieldError('username') ? true : undefined}
                    />
                  </div>
                  {isFieldError('username') && (
                    <p className="text-sm text-destructive">
                      {getFieldError('username')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-10"
                      aria-invalid={isFieldError('fullName') ? true : undefined}
                    />
                  </div>
                  {isFieldError('fullName') && (
                    <p className="text-sm text-destructive">
                      {getFieldError('fullName')}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="pl-10"
                      aria-invalid={
                        isFieldError('phoneNumber') ? true : undefined
                      }
                    />
                  </div>
                  {isFieldError('phoneNumber') && (
                    <p className="text-sm text-destructive">
                      {getFieldError('phoneNumber')}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10 pr-10"
                    aria-invalid={isFieldError('password') ? true : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {isFieldError('password') ? (
                  <p className="text-sm text-destructive">
                    {getFieldError('password')}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Referral Code (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder="Enter referral code"
                    value={formik.values.referralCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Get 10% discount coupon with a referral code!
                </p>
              </div>

              {/* EO Specific Fields */}
              {formik.values.role === 'EO' && (
                <>
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary" />
                      Event Organizer Information
                    </h3>

                    <div className="space-y-4">
                      {/* Organizer Name */}
                      <div className="space-y-2">
                        <Label htmlFor="organizerName">
                          Organization Name *
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="organizerName"
                            name="organizerName"
                            type="text"
                            placeholder="Your Company Name"
                            value={formik.values.organizerName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="pl-10"
                            aria-invalid={
                              isFieldError('organizerName') ? true : undefined
                            }
                          />
                        </div>
                        {isFieldError('organizerName') && (
                          <p className="text-sm text-destructive">
                            {getFieldError('organizerName')}
                          </p>
                        )}
                      </div>

                      {/* Company Address */}
                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">
                          Company Address *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Textarea
                            id="companyAddress"
                            name="companyAddress"
                            placeholder="Full company address"
                            value={formik.values.companyAddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="pl-10 min-h-20"
                            aria-invalid={
                              isFieldError('companyAddress') ? true : undefined
                            }
                          />
                        </div>
                        {isFieldError('companyAddress') && (
                          <p className="text-sm text-destructive">
                            {getFieldError('companyAddress')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11"
                size="lg"
                disabled={formik.isSubmitting}>
                {formik.isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  `Create ${formik.values.role === 'EO' ? 'Organizer' : 'Customer'} Account`
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => navigate('/login')}>
                Sign In Instead
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By creating an account, you agree to TickiTacka's{' '}
          <Link to="/terms" className="text-secondary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-secondary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
