import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

import Button from '@/components/ui/Button';

export default function CTASection() {
    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            {/* Background gradient */}
            <div
                className="absolute inset-0 bg-linear-to-br from-primary/5 via-secondary/10 to-accent/5"
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
                        <Sparkles className="h-7 w-7 text-primary" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to experience something amazing?
                    </h2>

                    <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto">
                        Join thousands of happy customers who trust TickiTacka for their
                        event bookings.
                    </p>

                    <Button asChild size="lg" className="px-8 h-12 shadow-lg">
                        <Link to="/events">Explore All Events</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
