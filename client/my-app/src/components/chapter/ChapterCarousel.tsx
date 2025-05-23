import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../ui/carousel';
import Image from 'next/image';

export const ChapterCarousel = ({
  images
}: {
  images: { url: string; page: number }[];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrentPage(selectedIndex);
    };

    // Add event listener
    api.on('select', onSelect);

    // Cleanup function
    return () => {
      api.off('select', onSelect);
    };
  }, [api]); // Remove currentPage from dependencies

  // Keyboard navigation
  useEffect(() => {
    if (!api) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          api.scrollNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          api.scrollPrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [api]);

  // Sync carousel with currentPage
  useEffect(() => {
    if (!api) return;
    api.scrollTo(currentPage);
  }, [api, currentPage]);

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'center',
          loop: false
        }}
      >
        <div className="mb-4 flex items-center justify-between px-4">
          <div className="text-muted-foreground text-sm">
            Page {currentPage + 1} of {images.length}
          </div>
        </div>

        <div className="relative">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <ChapterImage
                  url={image.url}
                  index={index}
                  currentPage={currentPage}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute inset-y-[50%] right-10 left-10 flex items-center justify-between px-4">
            <CarouselPrevious className="bg-background/50 hover:bg-background/70 relative h-12 w-12 translate-x-0 backdrop-blur-sm" />
            <CarouselNext className="bg-background/50 hover:bg-background/70 relative h-12 w-12 translate-x-0 backdrop-blur-sm" />
          </div>
        </div>
      </Carousel>
    </div>
  );
};

export const ImageSkeleton = () => (
  <div className="bg-muted/50 relative flex h-[70vh] w-full animate-pulse items-center justify-center rounded-lg">
    <div className="border-primary/20 border-t-primary h-16 w-16 animate-spin rounded-full border-4" />
  </div>
);

export const ChapterImage = ({
  url,
  index,
  currentPage
}: {
  url: string;
  index: number;
  currentPage: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${url}`;

  return (
    <div className="relative h-[70vh]">
      {isLoading && <ImageSkeleton />}
      <Image
        src={imageUrl}
        alt={`Page ${index + 1}`}
        fill
        className={`rounded-lg object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={Math.abs(index - currentPage) <= 1}
        quality={100}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
};
