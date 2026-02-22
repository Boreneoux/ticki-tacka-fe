import {
    Ticket,
    Tag,
    Clock,
    Minus,
    Plus
} from 'lucide-react';

import type { TicketType, EventVoucher } from '@/types/models';
import { formatPrice } from '../helpers';

import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';




type TicketTypesListProps = {
    ticketTypes: TicketType[];
    vouchers?: EventVoucher[];
    isPastEvent: boolean;
    isLoggedIn: boolean;
    selectedTickets: Record<string, number>;
    onTicketQtyChange: (ticketId: string, delta: number) => void;
    onCheckout: () => void;
};




export default function TicketTypesList({
    ticketTypes,
    vouchers,
    isPastEvent,
    isLoggedIn,
    selectedTickets,
    onTicketQtyChange,
    onCheckout
}: TicketTypesListProps) {
    const totalTickets = Object.values(selectedTickets).reduce(
        (sum, qty) => sum + qty,
        0
    );

    const totalPrice = Object.entries(selectedTickets).reduce(
        (sum, [ticketId, qty]) => {
            const ticket = ticketTypes.find(t => t.id === ticketId);
            return sum + (ticket?.price || 0) * qty;
        },
        0
    );

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    Select Tickets
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

                {isPastEvent && (
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>This event has already ended.</span>
                    </div>
                )}


                {ticketTypes.length === 0 && !isPastEvent && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No tickets available at the moment.
                    </p>
                )}


                {ticketTypes.map(ticket => {
                    const available = ticket.availableQuota;
                    const isAvailable = available > 0 && !isPastEvent;

                    return (
                        <div
                            key={ticket.id}
                            className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-sm text-foreground">
                                        {ticket.name}
                                    </h4>
                                    {ticket.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {ticket.description}
                                        </p>
                                    )}
                                </div>
                                <p className="font-bold text-primary text-sm whitespace-nowrap">
                                    {formatPrice(ticket.price)}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    {isAvailable ? (
                                        <span className="text-accent font-medium">
                                            {available} available
                                        </span>
                                    ) : isPastEvent ? (
                                        <span className="text-muted-foreground">Event ended</span>
                                    ) : (
                                        <span className="text-destructive font-medium">
                                            Sold out
                                        </span>
                                    )}
                                </span>

                                {isAvailable && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onTicketQtyChange(ticket.id, -1)}
                                            disabled={!selectedTickets[ticket.id]}
                                            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">
                                            {selectedTickets[ticket.id] || 0}
                                        </span>
                                        <button
                                            onClick={() => onTicketQtyChange(ticket.id, 1)}
                                            disabled={
                                                (selectedTickets[ticket.id] || 0) >=
                                                Math.min(available, 10)
                                            }
                                            className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}


                {vouchers && vouchers.length > 0 && isLoggedIn && (
                    <>
                        <div className="border-t border-border" />
                        <div>
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                                <Tag className="h-4 w-4 text-primary" />
                                Available Vouchers
                            </h4>
                            <div className="space-y-2">
                                {vouchers
                                    .filter(
                                        v => v.isActive && new Date(v.expiredAt) > new Date()
                                    )
                                    .map(voucher => (
                                        <div
                                            key={voucher.id}
                                            className="p-3 bg-primary/5 border border-primary/15 rounded-lg">
                                            <p className="font-semibold text-xs text-primary">
                                                {voucher.voucherCode}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {voucher.voucherName} •{' '}
                                                {voucher.discountType === 'percentage'
                                                    ? `${voucher.discountValue}% off`
                                                    : formatPrice(voucher.discountValue)}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}


                {!isPastEvent && (
                    <>
                        <div className="border-t border-border" />

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Total ({totalTickets}{' '}
                                {totalTickets === 1 ? 'ticket' : 'tickets'})
                            </span>
                            <span className="text-lg font-bold text-primary">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        <Button
                            onClick={onCheckout}
                            size="lg"
                            className="w-full"
                            disabled={totalTickets === 0}>
                            <Ticket className="h-4 w-4 mr-2" />
                            Proceed to Checkout
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
