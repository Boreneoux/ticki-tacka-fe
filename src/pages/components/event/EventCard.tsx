interface EventCardProps {
  event: any;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="border rounded p-4 shadow">
      <h2 className="text-xl font-semibold">{event.name}</h2>
      <p className="text-sm text-gray-500">
        {event.startDate} - {event.endDate}
      </p>
      <p className="mt-2">{event.description}</p>
      <p className="mt-2 font-bold">
        {event.isFree ? 'Free' : `Rp ${event.price}`}
      </p>
    </div>
  );
};

export default EventCard;

