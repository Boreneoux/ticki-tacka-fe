import { Tag, Calendar, Clock, Percent, DollarSign, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { EventVoucher } from '@/types/models';

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

type VoucherListProps = {
  vouchers: EventVoucher[];
  onCreateClick?: () => void;
};

export default function VoucherList({
  vouchers,
  onCreateClick
}: VoucherListProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Event Vouchers
          </div>
          {onCreateClick && (
            <Button size="sm" onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-1" /> Add Voucher
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {vouchers.length === 0 ? (
          <div className="text-center p-8 bg-muted/20 rounded-xl border border-dashed border-border/60">
            <Tag className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              No Vouchers Created
            </h3>
            <p className="text-sm text-muted-foreground">
              Create promotional vouchers to offer discounts to your attendees.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vouchers.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                      {v.voucherCode}
                      <Badge
                        variant={v.isActive ? 'success' : 'secondary'}
                        className="text-[10px] uppercase">
                        {v.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {v.voucherName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center font-bold text-primary text-xl">
                      {v.discountType === 'percentage' ? (
                        <>
                          {v.discountValue}
                          <Percent className="h-4 w-4 ml-0.5" />
                        </>
                      ) : (
                        <>
                          <span className="text-sm mr-1 tracking-wider uppercase font-medium">
                            IDR
                          </span>
                          {v.discountValue.toLocaleString('id-ID')}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-border/40 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Valid From
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDate(v.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Expires At
                    </span>
                    <span className="font-medium text-foreground">
                      {formatDate(v.expiredAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" /> Usage
                    </span>
                    <span className="font-medium text-foreground">
                      {v.usedCount} / {v.maxUsage}
                    </span>
                  </div>
                  {v.discountType === 'percentage' && v.maxDiscount && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" /> Max Discount
                      </span>
                      <span className="font-medium text-foreground">
                        IDR {v.maxDiscount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
