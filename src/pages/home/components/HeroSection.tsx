import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function HeroSection() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchInput.trim())}`);
        } else {
            navigate('/events');
        }
    };

    return (
        <section className="relative bg-linear-to-br from-primary via-secondary to-accent text-white py-16 md:py-24 overflow-hidden">
            {/* Background image overlay */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920')] bg-cover bg-center opacity-10"
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                        Discover Amazing Events
                    </h1>
                    <p className="text-base md:text-xl text-white/90 mb-8">
                        Find and book tickets for concerts, sports, theater, and more
                    </p>
                </div>

                {/* Search Bar — glassmorphism card */}
                <form
                    onSubmit={handleSearch}
                    className="max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 md:p-4"
                >
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search events..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-10 h-11 md:h-12 text-foreground"
                            />
                        </div>
                        <Button type="submit" className="h-11 md:h-12 px-6 shadow-lg">
                            <Search className="h-5 w-5 md:hidden" />
                            <span className="hidden md:inline">Search</span>
                        </Button>
                    </div>
                </form>
            </div>

            {/* Decorative gradient orbs */}
            <div
                className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent/30 rounded-full blur-3xl"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-secondary/30 rounded-full blur-3xl"
                aria-hidden="true"
            />
        </section>
    );
}
