import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button';

export default function CTASection() {
    return (
        <section className="relative py-20 md:py-28 overflow-hidden">
            {/* Background Gradient — Mediterranean Blue to Accent */}
            <div
                className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-accent"
                aria-hidden="true"
            />

            {/* Subtle Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '28px 28px'
                }}
                aria-hidden="true"
            />

            {/* Decorative Orbs */}
            <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-[1.15]">
                        Ready to experience something{' '}
                        <br className="hidden sm:block" />
                        amazing?
                    </h2>

                    <p className="text-base md:text-lg text-white/75 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                        Join thousands of happy customers who trust TickiTacka for their
                        event bookings.
                    </p>

                    <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 hover:text-primary h-12 px-10 rounded-xl font-bold text-base shadow-xl border-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Link to="/events">Explore All Events</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
