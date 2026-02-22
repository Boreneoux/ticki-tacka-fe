import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Ticket,
  Tag,
  Gift,
  AlertCircle,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

import useAuthStore from '@/stores/useAuthStore';
import {
  getPointsApi,
  getCouponsApi
} from '@/features/profile/api/profile.api';
import { createTransactionApi } from '@/features/transactions/api/transactions.api';
import { formatCurrency } from '@/utils/format';
import type { Event, EventVoucher } from '@/types/models';
import type { CouponEntry } from '@/features/profile/types';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Label from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const { isLogin } = useAuthStore();

  // Get data from navigation state
  const { selectedTickets, event } = (location.state as {
    selectedTickets: Record<string, number>;
    event: Event;
  }) || { selectedTickets: {}, event: null };

  // Redirect if no tickets selected or not logged in
  useEffect(() => {
    if (!isLogin) {
      toast.error('Please sign in to purchase tickets');
      navigate('/login');
      return;
    }

    if (
      !selectedTickets ||
      Object.keys(selectedTickets).length === 0 ||
      !event
    ) {
      navigate(`/events/${slug}`);
    }
  }, [selectedTickets, slug, navigate, isLogin, event]);

  // Discount state
  const [usePoints, setUsePoints] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [selectedVoucher, setSelectedVoucher] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User data
  const [pointBalance, setPointBalance] = useState(0);
  const [coupons, setCoupons] = useState<CouponEntry[]>([]);
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(true);

  // Fetch user points and coupons
  useEffect(() => {
    if (!isLogin) return;

    const fetchDiscountData = async () => {
      setIsLoadingDiscounts(true);
      try {
        const [pointsData, couponsData] = await Promise.all([
          getPointsApi(),
          getCouponsApi()
        ]);

        setPointBalance(pointsData.balance);
        setCoupons(couponsData.coupons.filter(c => c.status === 'active'));
      } catch {
        // Silently fail — discounts are optional
      } finally {
        setIsLoadingDiscounts(false);
      }
    };

    fetchDiscountData();
  }, [isLogin]);

  if (!event) return null;

  // Get ticket types from event data
  const ticketTypes = event.ticketTypes ?? [];

  // Calculate items
  const items = Object.entries(selectedTickets)
    .filter(([, quantity]) => quantity > 0)
    .map(([ticketId, quantity]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId);
      return {
        ticketTypeId: ticketId,
        ticket,
        quantity,
        subtotal: (ticket?.price ?? 0) * quantity
      };
    });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalTickets = items.reduce((sum, item) => sum + item.quantity, 0);

  // Available vouchers — active, started, not expired, quota remaining
  const availableVouchers = (
    event.eventVouchers ??
    event.vouchers ??
    []
  ).filter(
    (v: EventVoucher) =>
      v.isActive &&
      new Date(v.startDate) <= new Date() &&
      new Date(v.expiredAt) > new Date() &&
      v.usedCount < v.maxUsage
  );

  // Calculate points discount
  const maxPointsDiscount = Math.min(pointBalance, subtotal);
  const pointsDiscount = usePoints ? maxPointsDiscount : 0;

  // Calculate coupon discount
  const couponDiscount = useMemo(() => {
    if (!selectedCoupon || selectedCoupon === 'none') return 0;
    const coupon = coupons.find(c => c.id === selectedCoupon);
    if (!coupon) return 0;

    if (coupon.discountType === 'percentage') {
      return Math.floor((subtotal * coupon.discountValue) / 100);
    }
    return coupon.discountValue;
  }, [selectedCoupon, coupons, subtotal]);

  // Calculate voucher discount
  const voucherDiscount = useMemo(() => {
    if (!selectedVoucher || selectedVoucher === 'none') return 0;
    const voucher = availableVouchers.find(
      (v: EventVoucher) => v.id === selectedVoucher
    );
    if (!voucher) return 0;

    if (voucher.discountType === 'percentage') {
      let discount = Math.floor((subtotal * voucher.discountValue) / 100);
      if (voucher.maxDiscount) {
        discount = Math.min(discount, voucher.maxDiscount);
      }
      return discount;
    }
    return voucher.discountValue;
  }, [selectedVoucher, availableVouchers, subtotal]);

  const total = Math.max(
    0,
    subtotal - pointsDiscount - couponDiscount - voucherDiscount
  );

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        eventId: event.id,
        items: items.map(item => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity
        })),
        usePoints,
        ...(selectedCoupon &&
          selectedCoupon !== 'none' && { userCouponId: selectedCoupon }),
        ...(selectedVoucher &&
          selectedVoucher !== 'none' && { eventVoucherId: selectedVoucher })
      };

      const result = await createTransactionApi(payload);

      if (result.paymentStatus === 'done') {
        toast.success('Order confirmed! Your tickets are ready.');
        navigate('/transactions');
      } else {
        toast.success(
          'Order created! Please upload payment proof within 2 hours.'
        );
        navigate(`/transactions/${result.id}`);
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Failed to create order'
        : 'Failed to create order';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Button
            variant="ghost"
            onClick={() => navigate(`/events/${slug}`)}
            className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your ticket purchase
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <img
                      src={
                        event.eventImages?.[0]?.imageUrl ||
                        event.images?.[0] ||
                        '/placeholder-event.jpg'
                      }
                      alt={event.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.eventDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.venueName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Selected Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map(({ ticketTypeId, ticket, quantity, subtotal }) => (
                    <div
                      key={ticketTypeId}
                      className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {ticket?.name ?? 'Ticket'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(ticket?.price ?? 0)} × {quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(subtotal)}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Discount Options */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Discounts & Vouchers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Use Points */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label
                        htmlFor="use-points"
                        className="flex items-center space-x-2 cursor-pointer">
                        <Gift className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Use Points</p>
                          <p className="text-sm text-muted-foreground">
                            You have {pointBalance.toLocaleString('id-ID')}{' '}
                            points (= {formatCurrency(pointBalance)})
                          </p>
                        </div>
                      </Label>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="use-points"
                        checked={usePoints}
                        onChange={e => setUsePoints(e.target.checked)}
                        disabled={pointBalance === 0 || isLoadingDiscounts}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                    </label>
                  </div>

                  <div className="border-t" />

                  {/* User Coupons */}
                  <div>
                    <Label>User Coupon</Label>
                    {isLoadingDiscounts ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading coupons...
                      </p>
                    ) : coupons.length === 0 ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        No available coupons
                      </p>
                    ) : (
                      <Select
                        value={selectedCoupon}
                        onValueChange={setSelectedCoupon}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a coupon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No coupon</SelectItem>
                          {coupons.map(coupon => (
                            <SelectItem key={coupon.id} value={coupon.id}>
                              {coupon.couponCode} —{' '}
                              {coupon.discountType === 'percentage'
                                ? `${coupon.discountValue}% off`
                                : formatCurrency(coupon.discountValue)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="border-t" />

                  {/* Event Vouchers */}
                  <div>
                    <Label>Event Voucher</Label>
                    {availableVouchers.length === 0 ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        No available vouchers for this event
                      </p>
                    ) : (
                      <Select
                        value={selectedVoucher}
                        onValueChange={setSelectedVoucher}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a voucher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No voucher</SelectItem>
                          {availableVouchers.map((voucher: EventVoucher) => (
                            <SelectItem key={voucher.id} value={voucher.id}>
                              {voucher.voucherCode} — {voucher.voucherName} —{' '}
                              {voucher.discountType === 'percentage'
                                ? `${voucher.discountValue}% off`
                                : formatCurrency(voucher.discountValue)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Important Notice */}
              <Card className="border-l-4 border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-900 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Important</p>
                    <p>
                      You have 2 hours to complete the payment. If payment is
                      not made within this time, your order will be
                      automatically canceled and discounts will be rolled back.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({totalTickets} ticket
                      {totalTickets > 1 ? 's' : ''})
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* Discounts */}
                  {pointsDiscount > 0 && (
                    <div className="flex items-center justify-between text-accent">
                      <span className="text-sm">Points Discount</span>
                      <span className="font-semibold">
                        -{formatCurrency(pointsDiscount)}
                      </span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-accent">
                      <span className="text-sm">Coupon Discount</span>
                      <span className="font-semibold">
                        -{formatCurrency(couponDiscount)}
                      </span>
                    </div>
                  )}

                  {voucherDiscount > 0 && (
                    <div className="flex items-center justify-between text-accent">
                      <span className="text-sm">Voucher Discount</span>
                      <span className="font-semibold">
                        -{formatCurrency(voucherDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full shadow-lg"
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Ticket className="h-5 w-5 mr-2" />
                        {total === 0 ? 'Confirm Order' : 'Proceed to Payment'}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By clicking, you agree to our Terms & Conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
