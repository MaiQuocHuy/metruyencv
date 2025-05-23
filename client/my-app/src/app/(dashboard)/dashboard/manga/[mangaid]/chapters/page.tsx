'use client';
import { Separator } from '@/components/ui/separator';
import { BookOpen } from 'lucide-react';
import ChaptersSection from '@/components/section/ChaptersSection';
import { useParams } from 'next/navigation';
const DashboardChapters = () => {
  const params = useParams();
  const mangaId = params?.mangaid ? parseInt(params.mangaid as string) : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="from-manga-300 to-manga-500 flex items-center gap-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            <BookOpen className="text-manga-400 h-8 w-8" />
            Chapter Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload, edit, and organize manga chapters in one place
          </p>
        </div>
      </div>

      <Separator className="bg-manga-600/20 my-6" />

      <div className="animate-fade-in space-y-8">
        <ChaptersSection mangaid={mangaId} />
      </div>
    </div>
  );
};

export default DashboardChapters;
