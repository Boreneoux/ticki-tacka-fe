import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Badge from '@/components/ui/Badge';

type ImageGalleryProps = {
  images: string[];
  eventName: string;
  categoryName?: string;
};

export default function ImageGallery({
  images,
  eventName,
  categoryName
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  if (images.length === 0) return null;

  const goToPrev = () =>
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

  const handleStart = (clientX: number) => {
    setTouchEnd(null);
    setTouchStart(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setTouchEnd(clientX);
  };

  const handleEnd = () => {
    if (!isDragging || !touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }

    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="relative bg-muted text-foreground select-none">
      <div
        className="relative aspect-21/9 max-h-[480px] w-full overflow-hidden touch-pan-y"
        onTouchStart={e => handleStart(e.targetTouches[0].clientX)}
        onTouchMove={e => handleMove(e.targetTouches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}>
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            cursor:
              images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}>
          {images.map((img, i) => (
            <div key={i} className="w-full h-full shrink-0">
              <img
                src={img}
                alt={`${eventName} - image ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                draggable="false"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm cursor-pointer"
              aria-label="Previous image">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm cursor-pointer"
              aria-label="Next image">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {categoryName && (
          <Badge className="absolute top-4 left-4 shadow-md">
            {categoryName}
          </Badge>
        )}
      </div>
    </section>
  );
}
