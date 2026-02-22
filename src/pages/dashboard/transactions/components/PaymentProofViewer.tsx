import { useState } from 'react';
import { ImageIcon, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CountdownTimer from '@/components/ui/CountdownTimer';

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

type PaymentProofViewerProps = {
  paymentProofUrl: string | null;
  proofUploadedAt: string | null;
  confirmationDeadline: string | null;
  paymentDeadline: string;
  paymentStatus: string;
};

export default function PaymentProofViewer({
  paymentProofUrl,
  proofUploadedAt,
  confirmationDeadline,
  paymentDeadline,
  paymentStatus
}: PaymentProofViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <Card className="border-border/50 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-primary">
          <ImageIcon className="h-4 w-4" />
          Payment Proof
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentProofUrl ? (
          <>
            {/* Proof image */}
            <div
              className="relative cursor-zoom-in group"
              onClick={() => setIsZoomed(true)}>
              <img
                src={paymentProofUrl}
                alt="Payment Proof"
                className="w-full max-h-72 object-contain rounded-lg border border-border/50 bg-muted/20"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm">
              {proofUploadedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Uploaded at: {formatDateTime(proofUploadedAt)}</span>
                </div>
              )}

              {confirmationDeadline &&
                paymentStatus === 'waiting_for_admin_confirmation' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium text-xs mb-1">
                        Confirmation Deadline
                      </p>
                      <CountdownTimer deadline={confirmationDeadline} />
                    </div>
                  </div>
                )}
            </div>

            {/* Open full size button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => window.open(paymentProofUrl, '_blank')}>
              <ExternalLink className="h-4 w-4" />
              Open Full Size
            </Button>
          </>
        ) : (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground">
              No payment proof uploaded yet
            </p>

            {paymentStatus === 'waiting_for_payment' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-left">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 font-medium text-xs mb-1">
                    Payment Deadline
                  </p>
                  <CountdownTimer deadline={paymentDeadline} />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Lightbox */}
      {isZoomed && paymentProofUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}>
          <img
            src={paymentProofUrl}
            alt="Payment Proof (zoom)"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </Card>
  );
}
