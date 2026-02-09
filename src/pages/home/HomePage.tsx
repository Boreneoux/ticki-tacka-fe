import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import EventCard from '../components/event/EventCard';
import { getEvents } from '../services/event/EventService.tsx';

const HomePage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  // initial fetch (all upcoming events)
  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  // debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        getEvents(value).then(setEvents);
      }, 500),
    []
  );

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={search}
        onChange={onSearchChange}
        placeholder="Search events..."
        className="w-full p-3 border rounded mb-6"
      />

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
