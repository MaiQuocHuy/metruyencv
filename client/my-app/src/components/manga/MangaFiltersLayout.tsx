import { MangaListResult } from "@/services/apiManga";
import MangaSidebar from "./MangaSidebar";
import MangaResults from "./MangaResults";

interface MangaFiltersLayoutProps {
  mangaData?: MangaListResult;
  isLoading: boolean;
  itemsPerPage: number;
}

const MangaFiltersLayout = ({
  mangaData,
  isLoading,
  itemsPerPage,
}: MangaFiltersLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 px-3.5 lg:flex-row lg:gap-8">
      {/* Sidebar for larger screens */}
      <MangaSidebar />

      {/* Main Content */}
      <MangaResults
        mangaData={mangaData}
        isLoading={isLoading}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default MangaFiltersLayout;
