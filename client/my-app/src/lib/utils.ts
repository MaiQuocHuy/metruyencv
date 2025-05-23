import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';
import { HistoryEntry } from '@/types/history';
import { BadgeVariant } from '@/components/ui/badge';
import {
  ROLES,
  ADMIN_ROLE_ID,
  USER_ROLE_ID,
  STATUSES
} from '@/lib/constants/user';
import { RoleId } from '@/types/user';
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for sorting manga data
/**
 * Sorts manga data based on specified criteria
 * @param {Array} mangaData - Array of manga objects
 * @param {string} sortBy - Sorting criteria (popularity, latest, rating, etc.)
 * @param {boolean} ascending - Sort direction (true for ascending, false for descending)
 * @returns {Array} - Sorted array of manga objects
 */
export const sortMangaData = (
  mangaData: any,
  sortBy = 'popularity',
  ascending = false
) => {
  if (!mangaData || !Array.isArray(mangaData)) {
    return [];
  }

  const sortedData = [...mangaData];

  switch (sortBy.toLowerCase()) {
    case 'popularity':
      // Sort by views
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_views - b.manga_views
          : b.manga_views - a.manga_views;
      });
      break;

    case 'latest':
      // Sort by update date - fixed by using getTime()
      sortedData.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    case 'rating':
      // Sort by average rating (total stars / count)
      sortedData.sort((a, b) => {
        const ratingA =
          a.manga_ratings_count > 0
            ? a.manga_total_star_rating / a.manga_ratings_count
            : 0;
        const ratingB =
          b.manga_ratings_count > 0
            ? b.manga_total_star_rating / b.manga_ratings_count
            : 0;
        return ascending ? ratingA - ratingB : ratingB - ratingA;
      });
      break;

    case 'title':
      // Sort alphabetically by title
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_title.localeCompare(b.manga_title)
          : b.manga_title.localeCompare(a.manga_title);
      });
      break;

    case 'followers':
      // Sort by number of followers
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_number_of_followers - b.manga_number_of_followers
          : b.manga_number_of_followers - a.manga_number_of_followers;
      });
      break;

    case 'created':
      // Sort by creation date - fixed by using getTime()
      sortedData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    default:
      // Default sort by popularity (views)
      sortedData.sort((a, b) => b.manga_views - a.manga_views);
  }

  return sortedData;
};

/**
 * Transforms API response data to a consistent format
 * @param {Object} response - API response object
 * @returns {Array} - Formatted manga data array
 */
export const formatMangaData = (response: any) => {
  if (!response || !response.items || !Array.isArray(response.items)) {
    return [];
  }

  return response.items;
};

/**
 * Enhanced version with better types and additional sort options
 */
export interface MangaItem {
  manga_id: number;
  manga_title: string;
  manga_thumb: string;
  manga_slug: string;
  manga_description: string;
  manga_author: string;
  manga_status: 'ongoing' | 'completed' | 'hiatus';
  manga_views: number;
  manga_ratings_count: number;
  manga_total_star_rating: number;
  manga_number_of_followers: number;
  createdAt: string;
  updatedAt: string;

  [key: string]: any; // For additional properties
}

export type SortCriteria =
  | 'popularity'
  | 'latest'
  | 'rating'
  | 'title'
  | 'followers'
  | 'created';

/**
 * Type-safe manga sorting function
 */
export function sortManga<T extends MangaItem>(
  mangaData: T[],
  criteria: SortCriteria = 'popularity',
  ascending = false
): T[] {
  if (!mangaData || !Array.isArray(mangaData)) {
    return [];
  }

  const sortedData = [...mangaData];

  switch (criteria.toLowerCase() as SortCriteria) {
    case 'popularity':
      // Sort by views
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_views - b.manga_views
          : b.manga_views - a.manga_views;
      });
      break;

    case 'latest':
      // Sort by update date with proper type conversion
      sortedData.sort((a, b) => {
        // Safely handle potential invalid dates
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    case 'rating':
      // Sort by average rating
      sortedData.sort((a, b) => {
        const ratingA =
          a.manga_ratings_count > 0
            ? a.manga_total_star_rating / a.manga_ratings_count
            : 0;
        const ratingB =
          b.manga_ratings_count > 0
            ? b.manga_total_star_rating / b.manga_ratings_count
            : 0;
        return ascending ? ratingA - ratingB : ratingB - ratingA;
      });
      break;

    case 'title':
      // Sort alphabetically by title
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_title.localeCompare(b.manga_title)
          : b.manga_title.localeCompare(a.manga_title);
      });
      break;

    case 'followers':
      // Sort by number of followers
      sortedData.sort((a, b) => {
        return ascending
          ? a.manga_number_of_followers - b.manga_number_of_followers
          : b.manga_number_of_followers - a.manga_number_of_followers;
      });
      break;

    case 'created':
      // Sort by creation date with proper type conversion
      sortedData.sort((a, b) => {
        // Safely handle potential invalid dates
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      });
      break;

    default:
      // Default sort by popularity
      sortedData.sort((a, b) => b.manga_views - a.manga_views);
  }

  return sortedData;
}

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  if (!token) return true;

  try {
    // Extract the payload from the JWT token
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    // Decode the Base64 payload
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) return true; // No expiration claim found

    // Get current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired or will expire within buffer time
    return payload.exp <= currentTime + bufferSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If there's any error, consider the token expired
  }
}

export async function fetchAndParseIPFSData(
  cid: string
): Promise<ChapterImage[]> {
  if (!cid) return [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch IPFS content (${response.status}) for CID: ${cid}`
      );
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('IPFS data is not an array:', data);
      return [];
    }

    console.log('DataImage', data);

    const formattedImages = data
      .map((item: any, index: number): ChapterImage | null => {
        let imageUrl = item.image || item.url; // Allow 'url' as fallback
        const pageNumber = item.page;

        if (!imageUrl || typeof imageUrl !== 'string') {
          console.warn(
            `Missing or invalid image URL for item at index ${index}`,
            item
          );
          return null; // Skip invalid items
        }

        if (!imageUrl.startsWith('http')) {
          imageUrl = imageUrl.startsWith('//')
            ? `https:${imageUrl}`
            : imageUrl.includes('ipfs.io/ipfs/')
              ? // Don't add prefix to URLs that already have the IPFS gateway
                imageUrl
              : // Otherwise add the IPFS gateway
                `${process.env.NEXT_PUBLIC_API_URL_IPFS}${imageUrl}`;
        }

        return {
          id: `${pageNumber}`, // Create a more stable ID if possible, otherwise use index
          url: imageUrl,
          pageNumber: pageNumber
        };
      })
      .filter((img): img is ChapterImage => img !== null); // Filter out nulls

    formattedImages.sort((a, b) => a.pageNumber - b.pageNumber);
    return formattedImages;
  } catch (error) {
    console.error('Error fetching or parsing IPFS data:', error);
    return []; // Return empty array on error
  }
}

export function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'some time ago';
  }
}

/**
 * Determines the appropriate badge variant based on action type
 * @param type - The action type string
 * @returns The corresponding badge variant
 */
export const getBadgeVariant = (type: string): BadgeVariant => {
  switch (type) {
    case 'CreateManga':
      return 'default';
    case 'UpdateManga':
      return 'secondary';
    case 'Delete':
      return 'destructive';
    case 'PublishManga':
      return 'outline';
    case 'UnpublishManga':
      return 'secondary';
    case 'CreateCategoryForManga':
    case 'DeleteCategoryForMagna':
      return 'outline';
    case 'CreateChapter':
      return 'default'; // Changed from 'manga' to 'default' as 'manga' is not a valid variant
    case 'UpdateChapter':
      return 'secondary';
    case 'DeleteChapter':
      return 'destructive';
    case 'DeleteImageInChapterContent':
      return 'secondary';
    default:
      return 'secondary';
  }
};

// Filter and search history data
export const filterHistoryData = (
  historyData: HistoryEntry[],
  filterType: string,
  searchTerm: string
) => {
  let filtered = [...historyData];
  console.log('HistoryData', historyData);
  // Apply type filter
  if (filterType !== 'all') {
    filtered = filtered.filter((entry) => entry.type === filterType);
  }

  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (entry) =>
        entry.type.toLowerCase().includes(term) ||
        entry.changeLog.description.toLowerCase().includes(term) ||
        entry.changeLog.changes.some(
          (change) =>
            (change.field && change.field.toLowerCase().includes(term)) ||
            (change.oldValue && change.oldValue.toLowerCase().includes(term)) ||
            (change.newValue && change.newValue.toLowerCase().includes(term)) ||
            (change.manga_title &&
              change.manga_title.toLowerCase().includes(term)) ||
            (change.manga_author &&
              change.manga_author.toLowerCase().includes(term))
        )
    );
  }

  // Sort by version descending (newest first)
  return filtered.sort((a, b) => b.version - a.version);
};

// Get unique change types for filter dropdown
export const getChangeTypes = (historyData: HistoryEntry[]) => {
  return ['all', ...new Set(historyData.map((entry) => entry.type))];
};

/**
 * Fetches the complete version history of a manga from IPFS
 * @param latestCid - The CID of the latest version
 * @returns Promise resolving to an array of all version history entries
 */
export async function fetchCompleteVersionHistory(
  latestCid: string
): Promise<HistoryEntry[]> {
  if (!latestCid) {
    console.error('No CID provided to fetch version history');
    return [];
  }

  const history: HistoryEntry[] = [];
  let currentCid = latestCid;
  const processedCids = new Set<string>(); // To prevent infinite loops

  try {
    // Continue fetching until we reach a version with no previous version
    // or until we encounter a CID we've already processed
    while (currentCid && !processedCids.has(currentCid)) {
      console.log(`Fetching version data for CID: ${currentCid}`);
      processedCids.add(currentCid);

      // Fetch the current version data from IPFS
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IPFS}${currentCid}`
      );

      if (!response.ok) {
        console.log(
          `Failed to fetch IPFS content (${response.status}) for CID: ${currentCid}`
        );
        break;
      }

      const versionData: HistoryEntry = await response.json();

      // Add this version to our history array
      history.push(versionData);

      // Move to the previous version
      currentCid = versionData.previousVersion;

      // Safety check - if we've processed too many versions, break to prevent
      // potential infinite loops or excessive API calls
      if (history.length > 100) {
        console.warn('Reached maximum history depth (100 versions)');
        break;
      }
    }

    // Sort the history by version number (descending)
    return history.sort((a, b) => b.version - a.version);
  } catch (error) {
    console.error('Error fetching complete version history:', error);
    return history; // Return whatever we've managed to fetch so far
  }
}

/**
 * Fetches a specific version of manga data from IPFS
 * @param cid - The CID of the version to fetch
 * @returns Promise resolving to the history entry or null if not found
 */
export async function fetchVersionByCid(
  cid: string
): Promise<HistoryEntry | null> {
  if (!cid) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch IPFS content (${response.status}) for CID: ${cid}`
      );
    }

    const versionData: HistoryEntry = await response.json();
    return versionData;
  } catch (error) {
    console.error(`Error fetching version data for CID ${cid}:`, error);
    return null;
  }
}

export const fetchIPFSData = async (cid: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS content: ${response.status}`);
    }

    // Parse the JSON response which should contain the array of images
    const data = await response.json();

    // Format the data to match our expected format
    // Ensuring all URLs include protocol (https://)
    const formattedImages = Array.isArray(data)
      ? data.map((item) => {
          // Ensure the image URL has a protocol
          let imageUrl = item.image;
          if (imageUrl && !imageUrl.startsWith('http')) {
            // If URL doesn't have protocol, add https://
            imageUrl = imageUrl.startsWith('//')
              ? `https:${imageUrl}`
              : `https://${imageUrl}`;
          }

          return {
            url: imageUrl,
            page: item.page
          };
        })
      : [];

    // Check if the data is in the expected format
    console.log('Formatted Images:', formattedImages);

    // Sort by page number if needed
    formattedImages.sort((a, b) => a.page - b.page);
    return formattedImages;
  } catch (error) {
    console.error('Error fetching IPFS data:', error);
    // Fallback to empty array if there's an error
    return [];
  }
};

export const getUserName = async (userId: number): Promise<string> => {
  const defaultUserName = 'Unknown User';
  try {
    const accessToken = Cookies.get('access_token');
    // Assuming client_id is also stored in cookies. Adjust if stored differently.
    const clientId = Cookies.get('client_id');

    if (!accessToken || !clientId) {
      console.warn('Missing auth token or client ID for getUserName fetch.');
      return defaultUserName;
    }

    const parsedAccessToken = JSON.parse(accessToken);

    const response = await fetch(
      // Ensure NEXT_PUBLIC_API_URL_BACKEND is defined in your environment variables
      `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedAccessToken}`,
          // Use the actual client ID, not the access token again
          'x-client-id': clientId
        }
      }
    );

    if (!response.ok) {
      // Log more specific error information if possible
      console.error(
        `Failed to fetch user data for ID ${userId}: ${response.status} ${response.statusText}`
      );
      // Optionally try to read error message from response body
      // const errorBody = await response.text();
      // console.error("Error body:", errorBody);
      return defaultUserName;
    }

    const data = await response.json();

    // Adjust based on the actual API response structure
    // Assuming the name is within response.metadata.usr_name
    if (data && data.metadata && typeof data.metadata.usr_name === 'string') {
      return data.metadata.usr_name;
    } else {
      console.warn(
        `User name not found or invalid format in response for ID ${userId}:`,
        data
      );
      return defaultUserName;
    }
  } catch (error) {
    console.error(`Error fetching user name for ID ${userId}:`, error);
    return defaultUserName; // Return default name on any fetch/processing error
  }
};
