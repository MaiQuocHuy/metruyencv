import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';

interface ReaderImageDisplayProps {
  images: ChapterImage[];
  zoom: number;
  isLoading: boolean;
}

const renderSkeletonPages = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <div key={`skeleton-${index}`} className="w-full animate-pulse">
        <Skeleton className="aspect-[2/3] w-full rounded-lg bg-gray-800/50" />
      </div>
    ));
};

// Component cho mỗi ảnh với lazy loading
const LazyImage = ({
  image,
  index,
  zoom
}: {
  image: ChapterImage;
  index: number;
  zoom: number;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  });

  const parts = image.url.split('/');
  const cid = parts[parts.length - 1];

  return (
    <motion.div
      ref={ref}
      key={image.id}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.1, 1) // Cap delay at 1 second
      }}
    >
      <div
        className="group bg-card relative shadow-lg transition-all duration-300 hover:shadow-xl"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        {inView ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}`}
            alt={`Page ${index}`}
            width={800}
            height={1200}
            className="w-full object-contain"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAySURBVHgB7c0xAQAACAIw7f+PA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg8sP8AYvOQMVcDAAAAAElFTkSuQmCC"
          />
        ) : (
          <Skeleton className="aspect-[2/3] w-full rounded-lg bg-gray-800/50" />
        )}
        {inView && (
          <div className="absolute right-4 bottom-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
            Page {image.pageNumber}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ReaderImageDisplay: React.FC<ReaderImageDisplayProps> = ({
  images,
  zoom,
  isLoading
}) => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-2 py-4">
      <div className="w-full" style={{ maxWidth: `${zoom}%` }}>
        {isLoading
          ? renderSkeletonPages()
          : images.map((image, index) => (
              <LazyImage
                key={image.id}
                image={image}
                index={index}
                zoom={zoom}
              />
            ))}
      </div>
    </div>
  );
};

export default ReaderImageDisplay;
