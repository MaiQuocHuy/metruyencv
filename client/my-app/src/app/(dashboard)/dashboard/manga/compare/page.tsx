'use client';

import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Loader2, Eye } from 'lucide-react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { fetchIPFSData } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

/**
 * Interface for image comparison data
 */
interface ComparisonImage {
  /**
   * Source URL of the image
   */
  url: string;

  /**
   * Alternative text for the image
   */
  page: number;
}

/**
 * Component for rendering a single image card with lazy loading
 */
const ImageCard = React.memo(
  ({
    image,
    keyPrefix,
    index,
    borderClass
  }: {
    image: ComparisonImage;
    keyPrefix: string;
    index: number;
    borderClass?: string;
  }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '200px 0px',
      threshold: 0.1
    });

    return (
      <motion.div
        ref={ref}
        key={`${keyPrefix}-${index}`}
        className={`relative overflow-hidden rounded-md shadow-sm ${borderClass || ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {inView ? (
          <Image
            src={image.url}
            alt={`Page ${image.page}`}
            width={800}
            height={1200}
            className="aspect-[2/3] h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAySURBVHgB7c0xAQAACAIw7f+PA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg8sP8AYvOQMVcDAAAAAElFTkSuQmCC"
          />
        ) : (
          <div className="aspect-[2/3] w-full animate-pulse bg-gray-800/20" />
        )}
        <div className="bg-card/50 text-accent-foreground absolute right-0 bottom-0 left-0 p-2 text-center text-xs backdrop-blur-sm">
          Page {image.page}
        </div>
      </motion.div>
    );
  }
);

ImageCard.displayName = 'ImageCard';

/**
 * Component for comparing chapter content between two versions or viewing a single version
 */
const ChapterContentComparison = () => {
  const searchParams = useSearchParams();

  const oldcid = searchParams.get('oldcid') ?? undefined;
  const newcid = searchParams.get('newcid') ?? undefined;
  const remaincid = searchParams.get('remaincid') ?? undefined;
  const [oldImages, setOldImages] = useState<ComparisonImage[]>([]);
  const [newImages, setNewImages] = useState<ComparisonImage[]>([]);
  const [remainImages, setRemainImages] = useState<ComparisonImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const { getHistoryByCID } = useBlockchain({ autoConnect: true });

  /**
   * Fetches images based on provided CIDs
   */
  useEffect(() => {
    const fetchImages = async (): Promise<void> => {
      try {
        setIsLoading(true);

        // Determine if we're in compare mode (oldcid + newcid) or view mode (remaincid)
        if (oldcid && newcid) {
          setIsCompareMode(true);

          // Fetch old content
          const oldImageArray = await fetchIPFSData(oldcid);
          setOldImages(oldImageArray);

          // Fetch new content
          const newImageArray = await fetchIPFSData(newcid);
          console.log('newImageArray', newImageArray);
          console.log('oldImageArray', oldImageArray);
          setNewImages(newImageArray);
        } else if (remaincid) {
          setIsCompareMode(false);

          // Fetch remain content
          const remainImageArray = await fetchIPFSData(remaincid);
          setRemainImages(remainImageArray);
        } else {
          // No valid CIDs provided
          toast('Error', {
            description: 'No valid CIDs provided for comparison or viewing.'
          });
        }
      } catch (error) {
        console.log('Error fetching chapter content:', error);
        toast('Error', {
          description: 'Failed to fetch chapter content.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [oldcid, newcid, remaincid, getHistoryByCID]); // Removed getHistoryByCID as it's not used in fetchImages

  /**
   * Gets images that were added in the new version
   * @returns Array of added images
   */
  const getAddedImages = (): ComparisonImage[] => {
    if (!isCompareMode) return [];
    return newImages.filter((_, index) => index >= oldImages.length);
  };

  /**
   * Gets images that were removed from the old version by comparing URLs.
   * An image is considered removed if its URL is present in the old version
   * but not in the new version.
   * @returns Array of removed images
   */
  const getRemovedImages = (): ComparisonImage[] => {
    if (!isCompareMode) return [];

    // Create a Set of URLs from the new images for efficient lookup
    const newImageUrls = new Set(newImages.map((img) => img.url));

    // Filter old images: keep only those whose URL is NOT in the new image URL set
    return oldImages.filter((oldImage) => !newImageUrls.has(oldImage.url));
  };

  const addedImages = getAddedImages();
  const removedImages = getRemovedImages();

  /**
   * Renders the comparison view (oldcid vs newcid)
   */
  const renderComparisonView = () => (
    <div className="space-y-8">
      {/* Added Images Section */}
      {addedImages.length > 0 && (
        <Card className="bg-background/40 border-green-500/20">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold text-green-500">
              Added Images ({addedImages.length})
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {addedImages.map((image, index) => (
                <ImageCard
                  key={`added-${index}`}
                  image={image}
                  keyPrefix="added"
                  index={index}
                  borderClass="border-2 border-green-500/30"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Removed Images Section */}
      {removedImages.length > 0 && (
        <Card className="bg-background/40 border-red-500/20">
          <CardContent className="pt-6">
            <h2 className="mb-4 text-xl font-semibold text-red-500">
              Removed Images ({removedImages.length})
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {removedImages.map((image, index) => (
                <ImageCard
                  key={`removed-${index}`}
                  image={image}
                  keyPrefix="removed"
                  index={index}
                  borderClass="border-2 border-red-500/30"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Side by Side Comparison */}
      <Card className="bg-background/40">
        <CardContent className="pt-6">
          <h2 className="mb-4 text-xl font-semibold">
            Side by Side Comparison
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-manga-400 mb-3 text-lg font-medium">
                Old Version ({oldImages.length} images)
              </h3>
              <div className="border-manga-600/20 space-y-4 rounded-md border p-4">
                {oldImages.length > 0 ? (
                  oldImages.map((image, index) => (
                    <ImageCard
                      key={`old-${index}`}
                      image={image}
                      keyPrefix="old"
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center">
                    No images in old version
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-manga-400 mb-3 text-lg font-medium">
                New Version ({newImages.length} images)
              </h3>
              <div className="border-manga-600/20 space-y-4 rounded-md border p-4">
                {newImages.length > 0 ? (
                  newImages.map((image, index) => (
                    <ImageCard
                      key={`new-${index}`}
                      image={image}
                      keyPrefix="new"
                      index={index}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center">
                    No images in new version
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Renders the view mode (remaincid only) - Modernized Vertical Scroll
   */
  const renderViewMode = () => (
    <Card className="bg-background/40">
      <CardContent className="pt-6">
        <h2 className="mb-4 text-xl font-semibold">
          Chapter Content ({remainImages.length} Images)
        </h2>
        {remainImages.length > 0 ? (
          // Use a single column layout that naturally scrolls vertically
          <div className="mx-auto max-w-2xl space-y-6">
            {remainImages.map((image, index) => (
              <ImageCard
                key={`remain-${index}`}
                image={image}
                keyPrefix="remain"
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="border-manga-600/20 flex h-64 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground text-center">
              No images found in this version
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col space-y-2">
        <Link
          href="/dashboard/manga" // Corrected link? Assuming history is the parent page
          className="text-manga-400 hover:text-manga-300 flex items-center transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to History
        </Link>

        <h1 className="from-manga-300 to-manga-500 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
          {isCompareMode
            ? 'Chapter Content Comparison'
            : 'Chapter Content View'}
        </h1>

        <p className="text-muted-foreground">
          {isCompareMode
            ? 'Comparing content between versions'
            : 'Viewing content for a specific version'}
        </p>

        <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
          {isCompareMode ? (
            <>
              <span className="text-muted-foreground">Old CID:</span>
              <span className="bg-manga-600/20 rounded px-2 py-1">
                {oldcid}
              </span>
              <ArrowRight className="text-manga-400 h-4 w-4" />
              <span className="text-muted-foreground">New CID:</span>
              <span className="bg-manga-600/20 rounded px-2 py-1">
                {newcid}
              </span>
            </>
          ) : (
            <>
              <span className="text-muted-foreground">CID:</span>
              <span className="bg-manga-600/20 rounded px-2 py-1">
                {remaincid}
              </span>
              <Eye className="text-manga-400 ml-1 h-4 w-4" />
            </>
          )}
        </div>
      </div>

      <Separator className="bg-manga-600/20 my-6" />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
          <span className="text-manga-400 ml-2">
            Loading chapter content...
          </span>
        </div>
      ) : isCompareMode ? (
        renderComparisonView()
      ) : (
        renderViewMode()
      )}
    </div>
  );
};

export default ChapterContentComparison;
