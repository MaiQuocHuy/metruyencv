'use client';

import React, { useState, useEffect } from 'react';
import { getUserName } from '@/lib/utils'; // Assuming getUserName is correctly exported
import { Skeleton } from '@/components/ui/skeleton';

interface ReporterNameProps {
  userId: number;
}

const ReporterName: React.FC<ReporterNameProps> = ({ userId }) => {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state update on unmounted component
    setIsLoading(true);

    getUserName(userId)
      .then((fetchedName: any) => {
        if (isMounted) {
          setName(fetchedName);
        }
      })
      .catch((error) => {
        console.log(`Failed to fetch name for user ${userId}:`, error);
        if (isMounted) {
          setName('Error'); // Or keep 'Unknown User'
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [userId]); // Re-run effect if userId changes

  if (isLoading) {
    // You can use a Skeleton component for a loading state
    return <Skeleton className="h-4 w-[80px]" />;
  }

  return <>{name || 'Unknown'}</>; // Display fetched name or fallback
};

export default ReporterName;
