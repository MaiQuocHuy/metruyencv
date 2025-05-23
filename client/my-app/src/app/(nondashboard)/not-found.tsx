'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(
      '404 Error: User attempted to access non-existent route:',
      pathname
    );
  }, [pathname]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-manga-500 mb-4 text-6xl font-bold md:text-8xl">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-bold md:text-3xl">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. The journey
        continues elsewhere!
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild className="bg-manga-600 hover:bg-manga-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/library">
            <Search className="mr-2 h-4 w-4" />
            Browse Library
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
