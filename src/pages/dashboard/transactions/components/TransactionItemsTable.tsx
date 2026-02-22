import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { OrganizerTransactionDetailResponseData } from '@/features/transactions/types';
import { formatCurrency } from '@/utils/format';

type TransactionItemsTableProps = {
  transaction: OrganizerTransactionDetailResponseData;
};

export default function TransactionItemsTable({
  transaction
}: TransactionItemsTableProps) {
  const items = transaction.transactionItems ?? [];

  return (
    <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-primary">
          <ShoppingCart className="h-4 w-4" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Ticket items */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-y border-border/50">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Ticket Type
                </th>
                <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                  Qty
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  Unit Price
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {item.ticketType?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing summary */}
        <div className="px-4 py-4 space-y-2 border-t border-border/50">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(transaction.subtotal)}</span>
          </div>

          {transaction.pointsUsed > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Points Discount</span>
              <span className="text-green-600">
                −{formatCurrency(transaction.pointsUsed)}
              </span>
            </div>
          )}

          {transaction.couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Coupon
                {transaction.userCoupon && (
                  <span className="ml-1.5 font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {transaction.userCoupon.couponCode}
                  </span>
                )}
              </span>
              <span className="text-green-600">
                −{formatCurrency(transaction.couponDiscount)}
              </span>
            </div>
          )}

          {transaction.voucherDiscount > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Voucher
                {transaction.eventVoucher && (
                  <span className="ml-1.5 font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {transaction.eventVoucher.voucherCode}
                  </span>
                )}
              </span>
              <span className="text-green-600">
                −{formatCurrency(transaction.voucherDiscount)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-base pt-2 border-t border-border/50">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(transaction.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
