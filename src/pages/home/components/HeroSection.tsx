import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag } from 'lucide-react';

import useCategories from '@/features/events/hooks/useCategories';

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

  const { categories } = useCategories();

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === 'all' ? '' : value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('search', searchInput.trim());
    if (categoryId) params.set('category', categoryId);
    const query = params.toString();
    navigate(`/events${query ? `?${query}` : ''}`);
  };

  return (
    <section
      className="relative overflow-hidden pb-20 md:pb-28"
      style={{
        background:
          'linear-gradient(135deg, #023E8A 0%, #0077B6 45%, #0096C7 100%)'
      }}>
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920')] bg-cover bg-center opacity-[0.07]" />

      {/* Radial glow top-right */}
      <div
        className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-[#00B4D8]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial glow bottom-left */}
      <div
        className="absolute -bottom-20 -left-20 w-100 h-100 rounded-full bg-[#023E8A]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container mx-auto px-4 pt-16 md:pt-24 relative z-10">
        {/* Eyebrow label */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold tracking-widest uppercase rounded-full px-4 py-1.5 border border-white/20">
            <span className="size-1.5 rounded-full bg-[#90E0EF] inline-block" />
            TickiTacka — Your Event Universe
          </span>
        </div>

        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold text-white mb-5 tracking-tight leading-[1.1]">
            Discover &amp; Book{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Amazing Events</span>
              <span
                className="absolute left-0 -bottom-1 w-full h-1.5 rounded-full opacity-70"
                style={{
                  background: 'linear-gradient(90deg, #90E0EF, #00B4D8)'
                }}
                aria-hidden="true"
              />
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/75 font-normal max-w-lg mx-auto leading-relaxed">
            Concerts, sports, theater, workshops — find the perfect experience
            and secure your seat today.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch}>
            {/* Mobile: stacked layout */}
            <div className="flex flex-col gap-3 md:hidden">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search events..."
                  className="pl-10 h-11 bg-white rounded-xl border-0 shadow-lg text-sm"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                  <Select
                    value={categoryId || 'all'}
                    onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-11 pl-9 bg-white rounded-xl border-0 shadow-lg text-sm w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="h-11 px-5 rounded-xl shrink-0 font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #023E8A, #0077B6)'
                  }}>
                  <Search className="size-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Desktop: inline pill card */}
            <div className="hidden md:flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 gap-2">
              {/* Search input */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search events by name..."
                  className="pl-10 h-11 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm placeholder:text-muted-foreground"
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-border self-stretch my-1.5 shrink-0" />

              {/* Category */}
              <div className="relative shrink-0">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                <Select
                  value={categoryId || 'all'}
                  onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-11 pl-9 pr-4 w-44 border-0 shadow-none focus-visible:ring-0 text-sm bg-transparent">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <Button
                type="submit"
                className="h-11 px-6 rounded-xl shrink-0 font-semibold text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #023E8A, #0077B6)'
                }}>
                <Search className="size-4 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Quick category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {categories.slice(0, 5).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('category', cat.id);
                    navigate(`/events?${params.toString()}`);
                  }}
                  className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-medium px-4 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer">
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
