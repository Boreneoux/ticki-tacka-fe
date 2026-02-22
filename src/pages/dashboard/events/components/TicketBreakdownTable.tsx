import type { TicketBreakdownItem } from '@/features/dashboard/types';

type Props = {
  breakdown: TicketBreakdownItem[];
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export default function TicketBreakdownTable({ breakdown }: Props) {
  if (breakdown.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6">
        No ticket types found.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/30 bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Ticket Breakdown</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Sales & revenue per ticket type
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                Ticket Type
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Quota
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Sold
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Remaining
              </th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {breakdown.map((item, idx) => {
              const remaining = item.quota - item.soldCount;
              const soldPct =
                item.quota > 0
                  ? Math.round((item.soldCount / item.quota) * 100)
                  : 0;

              return (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">
                    {item.price === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatCurrency(item.price)
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">
                    {item.quota.toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-medium text-foreground">
                        {item.soldCount.toLocaleString('id-ID')}
                      </span>
                      {/* Mini progress bar */}
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${soldPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {soldPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted-foreground">
                    {remaining.toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-primary">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-border">
        {breakdown.map((item, idx) => {
          const remaining = item.quota - item.soldCount;
          const soldPct =
            item.quota > 0
              ? Math.round((item.soldCount / item.quota) * 100)
              : 0;

          return (
            <div key={idx} className="px-5 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{item.name}</span>
                <span className="font-semibold text-primary">
                  {formatCurrency(item.revenue)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="text-muted-foreground">Price</div>
                <div className="text-right">
                  {item.price === 0 ? (
                    <span className="text-success font-medium">Free</span>
                  ) : (
                    formatCurrency(item.price)
                  )}
                </div>

                <div className="text-muted-foreground">Quota</div>
                <div className="text-right">
                  {item.quota.toLocaleString('id-ID')}
                </div>

                <div className="text-muted-foreground">Remaining</div>
                <div className="text-right">
                  {remaining.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Sold progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sold</span>
                  <span>
                    {item.soldCount.toLocaleString('id-ID')} ({soldPct}%)
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${soldPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
