import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

import useCategories from '@/features/events/hooks/useCategories';
import { useCities } from '@/features/events/hooks/useLocations';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select';

export default function HeroSection() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [cityId, setCityId] = useState('');

    const { categories } = useCategories();
    const { cities, isLoading: isCitiesLoading } = useCities(undefined);

    const handleCategoryChange = useCallback((value: string) => {
        setCategoryId(value === 'all' ? '' : value);
    }, []);

    const handleCityChange = useCallback((value: string) => {
        setCityId(value === 'all' ? '' : value);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchInput.trim()) params.set('search', searchInput.trim());
        if (categoryId) params.set('category', categoryId);
        if (cityId) params.set('city', cityId);
        const query = params.toString();
        navigate(`/events${query ? `?${query}` : ''}`);
    };

    return (
        <section
            className="relative overflow-hidden pb-16 md:pb-20"
            style={{ background: 'linear-gradient(135deg, #0077B6 0%, #00A8E8 40%, #38BDF8 100%)' }}
        >
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920')] bg-cover bg-center opacity-10" />

            {/* Confetti/Particle Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 10% 15%, white 1.5px, transparent 1.5px),
                        radial-gradient(circle at 85% 25%, white 1px, transparent 1px),
                        radial-gradient(circle at 40% 8%, white 2px, transparent 2px),
                        radial-gradient(circle at 72% 42%, white 1px, transparent 1px),
                        radial-gradient(circle at 20% 55%, white 1.5px, transparent 1.5px),
                        radial-gradient(circle at 92% 58%, white 2px, transparent 2px),
                        radial-gradient(circle at 55% 30%, white 1px, transparent 1px),
                        radial-gradient(circle at 30% 80%, white 1.5px, transparent 1.5px),
                        radial-gradient(circle at 65% 70%, white 2px, transparent 2px),
                        radial-gradient(circle at 80% 85%, white 1px, transparent 1px),
                        radial-gradient(circle at 15% 40%, white 1px, transparent 1px),
                        radial-gradient(circle at 50% 60%, white 1.5px, transparent 1.5px)
                    `,
                    backgroundSize: '200px 200px, 150px 150px, 180px 180px, 120px 120px, 160px 160px, 140px 140px, 100px 100px, 130px 130px, 170px 170px, 110px 110px, 190px 190px, 145px 145px'
                }}
                aria-hidden="true"
            />

            {/* Soft light overlay for depth */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent" aria-hidden="true" />

            {/* Content */}
            <div className="container mx-auto px-4 pt-12 md:pt-16 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                    <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-4 tracking-tight leading-[1.1] drop-shadow-sm">
                        Discover Amazing Events
                    </h1>
                    <p className="text-base md:text-lg text-white/85 font-normal max-w-xl mx-auto leading-relaxed">
                        Find and book tickets for concerts, sports, theater, and more
                    </p>
                </div>

                {/* Filter Card */}
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={handleSearch}
                        className="bg-white rounded-2xl shadow-2xl p-2 md:p-3"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-0">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#94a3b8] pointer-events-none" />
                                <Input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search events..."
                                    className="pl-12 pr-4 h-12 border-0 shadow-none focus-visible:ring-0 text-foreground bg-transparent placeholder:text-[#94a3b8] text-[15px]"
                                />
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px bg-[#e2e8f0] self-stretch my-2" />

                            {/* Category Select */}
                            <Select
                                value={categoryId || 'all'}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="h-12 min-w-[170px] border-0 shadow-none focus-visible:ring-0 text-[15px] text-foreground px-5">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Divider */}
                            <div className="hidden md:block w-px bg-[#e2e8f0] self-stretch my-2" />

                            {/* City Select */}
                            <Select
                                value={cityId || 'all'}
                                onValueChange={handleCityChange}
                            >
                                <SelectTrigger className="h-12 min-w-[150px] border-0 shadow-none focus-visible:ring-0 text-[15px] text-foreground px-5">
                                    <SelectValue
                                        placeholder={
                                            isCitiesLoading
                                                ? 'Loading...'
                                                : 'All Cities'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city.id} value={city.id}>
                                            {city.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Search Button */}
                            <div className="p-1 md:pl-2">
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl shrink-0 bg-[#1a3a4a] hover:bg-[#152f3d] text-white"
                                >
                                    <Search className="size-5" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
