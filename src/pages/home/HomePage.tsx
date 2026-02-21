import useEvents from '@/features/events/hooks/useEvents';
import HeroSection from './components/HeroSection';
import RecentEventsSection from './components/RecentEventsSection';
import CTASection from './components/CTASection';

export default function HomePage() {
  const { events, isLoading } = useEvents({ page: 1, limit: 8 });

  return (
    <>
      <HeroSection />
      <RecentEventsSection events={events} isLoading={isLoading} />
      <CTASection />
    </>
  );
}
