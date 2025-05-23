import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  timeout: 60000, // Set timeout to 60 seconds (default is usually 10 seconds)
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.tokens;
    const clientId = state.auth?.clientId;
    console.log('State:', state.auth);
    // Set auth headers if token exists
    if (token?.access_token) {
      headers.set('Authorization', `Bearer ${token.access_token}`);
      console.log('user', clientId);
      // Use user ID if available, fallback to "2" for testing
      headers.set('x-client-id', clientId);

      console.log('Request headers include auth token');
    }

    return headers;
  }
});

// Define types for API responses
interface ApiResponse<T> {
  status: boolean;
  path: string;
  statusCode: number;
  statusReason: string;
  message: string;
  metadata: T;
  option: Record<string, any>;
  timestamp: string;
}

export interface MangaType {
  manga_id: number;
  manga_title: string;
  manga_description?: string;
  manga_thumb: string;
  manga_author?: string;
  manga_status?: 'completed' | 'draft' | 'ongoing' | 'hiatus';
  manga_views?: number;
  manga_total_star_rating?: number;
  manga_number_of_followers: number;
  manga_ratings_count: number;
  createdAt?: string;
  updatedAt?: string;
  manga_slug?: string;
}

// Manga interfaces
export interface MangaAdmin extends MangaType {
  is_deleted?: number | number;
  is_draft?: number | number;
  is_published?: number | boolean;
}

export interface MangaCategory {
  category_id: number;
  category_name: string;
}

export interface MangaChapter {
  chap_id: number;
  chap_manga_id: number;
  chap_number: number;
  chap_title?: string;
  chap_views?: number;
  createdAt?: string;
  updatedAt?: string;
  is_deleted?: number;
}

export interface MangaChapterDetail extends MangaChapter {
  chap_content?: string;
}

export interface MangaChapterImage {
  pages: MangaImage[];
}

export interface MangaImage {
  page: number;
  image_url: string;
}

// Request and response interfaces
export interface MangaQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category_id?: number;
  keyword?: string;
  manga_status?: string;
  sortMangaByItem?: {
    key: string;
    value: boolean;
  };
}

export interface MangaListResult {
  mangas: MangaAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type MangaCreateRequestObject = {
  manga_title: string;
  manga_description: string;
  manga_author: string;
  manga_thumb: File;
  category_id: number[];
};

// Use the union for the full type
export type MangaCreateRequest = MangaCreateRequestObject | FormData;

// Extend the object part only
export interface MangaUpdateRequest extends Partial<MangaCreateRequestObject> {
  manga_id: number;
  formData: FormData;
}

type ChapterCreateRequestObject = {
  chap_number: number;
  chap_title: string;
  chap_content: File[];
};

// This type should include the manga_id
export type ChapterCreateRequest = {
  manga_id: number;
  chap_title: string;
  chap_number: number;
  listCids: string[];
};
export interface ChapterUpdateRequest {
  chap_id: number;
  formData: FormData;
}

export interface ChapterImageUploadRequest {
  chapter_id: number;
  images: File[];
}

export interface MangaWithCategories extends MangaAdmin {
  categories: MangaCategory[];
}

// Create a more flexible interface for detailed manga information
export interface MangaDetail extends MangaAdmin {
  categories?: MangaCategory[];
  chapters?: MangaChapter[];
  createdAt?: string;
  updatedAt?: string;
  // Add any other properties that might be returned by different endpoints
  related_manga?: MangaAdmin[];
  tags?: { tag_id: number; tag_name: string }[];
  // You can add more potential properties here
}

export interface MangaFav {
  manga_id: number;
  fav_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface MangaFavDetail extends MangaFav {
  manga: {
    manga_title: string;
    manga_thumb: string;
  };
}

export interface Comment {
  comment_id: number;
  comment_chapter_id: number;
  comment_user_id: number;
  comment_content: string;
  comment_manga_id: number;
  comment_parent_id: number | null;
  updatedAt: string;
  createdAt: string;
  user: {
    usr_id: number;
    usr_name: string;
  };
}

export interface User {
  usr_id: number;
  usr_name: string;
  usr_email: string;
  usr_avatar: string;
  usr_sex: string;
}

export type Avatar = Pick<User, 'usr_avatar'>;

export interface CIDStorage {
  cid: string;
}

// Create the API slice
export const mangaApi = createApi({
  reducerPath: 'mangaApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['MangaAdmin', 'Chapter', 'MangaList', 'Favorite', 'User'],
  endpoints: (builder) => ({
    // Get all manga with pagination, filtering and sorting
    getAllManga: builder.query<MangaListResult, MangaQueryParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add required parameters with defaults
        queryParams.append('page', String(params.page || 1));
        queryParams.append('limit', String(params.limit || 20));
        return {
          url: `/manga/${params.sort === 'unpublished' ? 'unpublish' : 'publish'}?${queryParams.toString()}`,
          method: 'GET'
        };
      },

      transformResponse: (response: ApiResponse<MangaAdmin[]>) => {
        console.log('Raw manga response:', response);

        // Handle potential error responses
        if (!response.metadata || response.statusCode >= 400) {
          console.log('API Error:', response.message || 'Unknown error');
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1
          };
        }

        // Extract manga array from metadata
        const mangas = Array.isArray(response.metadata)
          ? response.metadata
          : [];

        // Extract pagination from options
        const pagination = response.option?.pagination || {
          page: 1,
          limit: 20,
          total: mangas.length,
          totalPages: 1
        };

        // Format according to your MangaListResult interface with proper type handling
        return {
          mangas: mangas.map((manga) => ({
            manga_id: manga.manga_id,
            manga_title: manga.manga_title || '',
            manga_description: manga.manga_description || '',
            manga_thumb: manga.manga_thumb || '',
            manga_author: manga.manga_author || '',
            manga_status: manga.manga_status || 'ongoing',
            manga_views: Number(manga.manga_views) || 0,
            manga_ratings_count: Number(manga.manga_ratings_count) || 0,
            manga_total_star_rating: Number(manga.manga_total_star_rating) || 0,
            manga_number_of_followers:
              Number(manga.manga_number_of_followers) || 0,
            createdAt: manga.createdAt || new Date().toISOString(),
            updatedAt: manga.updatedAt || new Date().toISOString(),
            manga_slug: manga.manga_slug || '',
            is_deleted: manga.is_deleted || 0,
            is_draft: manga.is_draft || 0,
            is_published: manga.is_published || 0
          })),
          total: Number(pagination.total) || mangas.length,
          page: Number(pagination.page) || 1,
          limit: Number(pagination.limit) || 20,
          totalPages: Number(pagination.totalPages) || 1
        };
      },
      providesTags: (result) =>
        result?.mangas
          ? [
              ...result.mangas.map(({ manga_id }) => ({
                type: 'MangaAdmin' as const,
                id: manga_id
              })),
              { type: 'MangaList' as const, id: 'LIST' }
            ]
          : [{ type: 'MangaList' as const, id: 'LIST' }]
    }),

    // Then update your getMangaById query to use this interface
    getMangaById: builder.query<
      MangaDetail,
      {
        id: number;
        isPublished?: string | null;
      }
    >({
      query: (params) => {
        const { id, isPublished } = params;

        // Check the isPublished parameter value
        // Convert different input types to consistent values for comparison
        if (isPublished === null || isPublished === undefined) {
          // Default case - use published endpoint if no preference specified
          return {
            url: `/manga/details/${id}`
          };
        }

        // Handle string values like 'published'/'unpublished'
        if (typeof isPublished === 'string') {
          if (isPublished === 'publish') {
            return {
              url: `/manga/details/${id}`
            };
          } else if (isPublished === 'unpublish') {
            return {
              url: `/manga/details/unpublish/${id}`
            };
          }
        }

        // Handle boolean/number values (true/false/1/0)
        const isPublishedBoolean =
          isPublished === '1' || isPublished === 'true';

        if (isPublishedBoolean) {
          return {
            url: `/manga/details/${id}`
          };
        }

        // For all other cases (false, 0, etc.) use unpublished endpoint
        return {
          url: `/manga/details/unpublish/${id}`
        };
      },
      transformResponse: (response: ApiResponse<any>) => {
        console.log(response);
        if (!response.metadata) {
          throw new Error('Manga not found');
        }

        // Transform the response to match the MangaDetail interface
        const mangaDetail: MangaDetail = {
          ...response.metadata,
          // Ensure categories is properly formatted if it exists
          categories: Array.isArray(response.metadata.categories)
            ? response.metadata.categories
            : []
        };

        return mangaDetail;
      },
      providesTags: (result, error, arg) => [{ type: 'MangaAdmin', id: arg.id }]
    }),

    // Get manga by category ID
    getMangaByCategory: builder.query<
      MangaListResult,
      { categoryId: number; params?: MangaQueryParams }
    >({
      query: ({ categoryId, params = {} }) => ({
        url: `/manga/category/${categoryId}`,
        params
      }),
      transformResponse: (response: ApiResponse<MangaListResult>) => {
        if (!response.metadata) {
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          };
        }
        return response.metadata;
      },
      providesTags: (result, error, { categoryId }) => [
        { type: 'MangaList', id: `CATEGORY_${categoryId}` }
      ]
    }),

    // Create manga
    createManga: builder.mutation<MangaAdmin, MangaCreateRequest>({
      query: (manga) => {
        return {
          url: '/manga',
          method: 'POST',
          body: manga,
          formData: true
        };
      },

      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to create manga');
        }
        return response.metadata;
      },
      invalidatesTags: [{ type: 'MangaList', id: 'LIST' }]
    }),

    // Update manga
    updateMangaById: builder.mutation<MangaAdmin, MangaUpdateRequest>({
      query: ({ manga_id, formData }) => ({
        url: `/manga/${manga_id}`,
        method: 'PATCH',
        body: formData,
        formData: true
      }),
      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to update manga');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { manga_id }) => [
        { type: 'MangaAdmin', id: manga_id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    // Update manga categories
    // updateMangaCategories: builder.mutation<
    //   MangaAdmin,
    //   {
    //     mangaId: number;
    //     newCategories: number[];
    //     removedCategories: number[];
    //   }
    // >({
    //   query: ({ mangaId, newCategories, removedCategories }) => {
    //     // Kiểm tra và đảm bảo có ít nhất một trường được gửi đi
    //     if (newCategories.length === 0 && removedCategories.length === 0) {
    //       throw new Error('At least one category must be provided');
    //     }

    //     // Tạo object chứa dữ liệu
    //     const formData: Record<string, string> = {};

    //     if (newCategories.length > 0) {
    //       formData.listNewCategoryId = newCategories.join(',');
    //     }

    //     if (removedCategories.length > 0) {
    //       formData.listRemoveCategoryId = removedCategories.join(',');
    //     }

    //     // Chuyển đổi object thành x-www-form-urlencoded string
    //     const body = Object.entries(formData)
    //       .map(([key, value]) => `${key}=${value}`)
    //       .join('&');

    //     return {
    //       url: `/manga/manga-category/${mangaId}`,
    //       method: 'POST',
    //       body,
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       }
    //     };
    //   },
    //   transformResponse: (response: ApiResponse<MangaAdmin>) => {
    //     if (!response.metadata) {
    //       throw new Error('Failed to update manga categories');
    //     }
    //     return response.metadata;
    //   },
    //   invalidatesTags: (result, error, { mangaId }) => [
    //     { type: 'MangaAdmin', id: mangaId },
    //     { type: 'MangaList', id: 'LIST' }
    //   ]
    // }),

    // Update manga categories
    updateMangaCategories: builder.mutation<
      { success: boolean; message: string },
      {
        mangaId: number;
        newCategories: number[];
        removedCategories: number[];
      }
    >({
      query: ({ mangaId, newCategories, removedCategories }) => {
        // Create URLSearchParams for x-www-form-urlencoded format
        const params = new URLSearchParams();

        // Convert arrays to comma-separated strings
        if (newCategories.length > 0) {
          params.append('listNewCategoryId', newCategories.join(','));
        }
        if (removedCategories.length > 0) {
          params.append('listRemoveCategoryId', removedCategories.join(','));
        }

        return {
          url: `/manga/manga-category/${mangaId}`,
          method: 'POST',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      },
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { mangaId }) => [
        { type: 'MangaAdmin', id: mangaId },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    publishManga: builder.mutation<MangaAdmin, number>({
      query: (id) => ({
        url: `/manga/publish/${id}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to publish manga');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, id) => [
        { type: 'MangaAdmin', id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    unpublishManga: builder.mutation<MangaAdmin, number>({
      query: (id) => ({
        url: `/manga/unpublish/${id}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<MangaAdmin>) => {
        if (!response.metadata) {
          throw new Error('Failed to unpublish manga');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, id) => [
        { type: 'MangaAdmin', id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    // Delete manga
    deleteManga: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/manga/${id}`,
        method: 'DELETE'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: 'MangaAdmin', id },
        { type: 'MangaList', id: 'LIST' }
      ]
    }),

    // Get manga chapters
    getMangaChapters: builder.query<MangaChapter[], number>({
      query: (mangaId) => `/chapter/${mangaId}`,
      transformResponse: (response: ApiResponse<MangaChapter[]>) => {
        if (!response.metadata || !Array.isArray(response.metadata)) {
          return [];
        }

        return response.metadata.map((chapter) => ({
          chap_id: chapter.chap_id,
          chap_manga_id: chapter.chap_manga_id,
          chap_number: chapter.chap_number,
          chap_title: chapter.chap_title || 'error',
          chap_views: chapter.chap_views || 0,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          isDeleted: chapter.is_deleted
        }));
      },
      providesTags: (result, error, mangaId) => [
        { type: 'Chapter', id: `MANGA_${mangaId}` }
      ]
    }),

    // Get chapter detail
    getChapterDetail: builder.query<
      MangaChapterDetail,
      { mangaId: number; chapterId: number }
    >({
      query: ({ mangaId, chapterId }) =>
        `/chapter/details/${chapterId}/manga/${mangaId}`,
      transformResponse: (response: ApiResponse<MangaChapterDetail>) => {
        if (!response.metadata) {
          throw new Error('Chapter not found');
        }
        return response.metadata;
      },
      providesTags: (result, error, { chapterId }) => [
        { type: 'Chapter', id: chapterId }
      ]
    }),

    // Create chapter
    createChapter: builder.mutation<MangaChapter, ChapterCreateRequest>({
      query: ({ listCids, chap_title, chap_number, manga_id }) => ({
        url: `/chapter/${manga_id}`,
        method: 'POST',
        body: {
          chap_title,
          chap_number,
          list_cid: listCids
        }
      }),
      transformResponse: (response: ApiResponse<MangaChapter>) => {
        if (!response.metadata) {
          throw new Error('Failed to create chapter');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { manga_id }) => [
        { type: 'Chapter', id: `MANGA_${manga_id}` },
        { type: 'MangaAdmin', id: manga_id }
      ]
    }),

    // Update chapter
    updateChapter: builder.mutation<MangaChapterDetail, ChapterUpdateRequest>({
      query: ({ chap_id, formData }) => ({
        url: `/chapter/${chap_id}`,
        method: 'PATCH',
        body: formData,
        formData: true
      }),
      transformResponse: (response: ApiResponse<MangaChapterDetail>) => {
        if (!response.metadata) {
          throw new Error('Failed to update chapter');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { chap_id }) => [
        { type: 'Chapter', id: chap_id }
      ]
    }),

    // Fix deleteChapter mutation
    deleteChapter: builder.mutation<
      { success: boolean; message: string },
      { mangaId: number; chapterId: number }
    >({
      query: ({ chapterId }) => ({
        url: `/chapter/${chapterId}`,
        method: 'DELETE'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        if (!response.metadata) {
          throw new Error('Failed to delete chapter');
        }
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { mangaId, chapterId }) => [
        { type: 'Chapter', id: chapterId },
        { type: 'Chapter', id: `MANGA_${mangaId}` },
        { type: 'MangaAdmin', id: mangaId }
      ]
    }),
    // Format like this to delete chap_content_cid: bafkreih5wq6wcy7q25swk4oucbs2byukg3kvh4b6dfokxpqvx2hmlaraxu,bafybeib6qac4acmoalpr4vt3hn3oxwwm2zswu77tys5tihkcdxbai4fqre
    deleteImageInChapter: builder.mutation<
      { success: boolean; message: string },
      { chapterId: number; contentCids: string[] }
    >({
      query: ({ chapterId, contentCids }) => {
        // Join the CIDs with commas
        const cidString = contentCids.join(',');

        // Create URLSearchParams instead of FormData for x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('chap_content_cid', cidString);

        return {
          url: `/chapter/${chapterId}/content`,
          method: 'DELETE',
          body: params.toString(), // Convert to string format
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      },
      transformResponse: (response: ApiResponse<null>) => {
        if (!response.metadata) {
          throw new Error('Failed to delete image');
        }
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { chapterId }) => [
        { type: 'Chapter', id: chapterId }
      ]
    }),

    searchManga: builder.query<MangaListResult, MangaQueryParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add required parameters with defaults
        queryParams.append('page', String(params.page || 1));
        queryParams.append('limit', String(params.limit || 20));
        queryParams.append('publish', String(true));
        if (params.category_id)
          queryParams.append('category_id', String(params.category_id));
        if (params.manga_status)
          queryParams.append('manga_status', String(params.manga_status));
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.sortMangaByItem) {
          queryParams.append(
            params.sortMangaByItem.key,
            String(params.sortMangaByItem.value)
          );
        }
        return {
          url: `/manga/search?${queryParams.toString()}`,
          method: 'GET'
        };
      },

      transformResponse: (response: ApiResponse<MangaAdmin[]>) => {
        console.log('Raw manga response:', response);

        // Handle potential error responses
        if (!response.metadata || response.statusCode >= 400) {
          console.log('API Error:', response.message || 'Unknown error');
          return {
            mangas: [],
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1
          };
        }

        // Extract manga array from metadata
        const mangas = Array.isArray(response.metadata)
          ? response.metadata
          : [];

        // Extract pagination from options
        const pagination = response.option?.pagination || {
          page: 1,
          limit: 20,
          total: mangas.length,
          totalPages: 1
        };

        // Format according to your MangaListResult interface with proper type handling
        return {
          mangas: mangas.map((manga) => ({
            manga_id: manga.manga_id,
            manga_title: manga.manga_title || '',
            manga_description: manga.manga_description || '',
            manga_thumb: manga.manga_thumb || '',
            manga_author: manga.manga_author || '',
            manga_status: manga.manga_status || 'ongoing',
            manga_views: Number(manga.manga_views) || 0,
            manga_ratings_count: Number(manga.manga_ratings_count) || 0,
            manga_total_star_rating: Number(manga.manga_total_star_rating) || 0,
            manga_number_of_followers:
              Number(manga.manga_number_of_followers) || 0,
            createdAt: manga.createdAt || new Date().toISOString(),
            updatedAt: manga.updatedAt || new Date().toISOString(),
            manga_slug: manga.manga_slug || '',
            is_deleted: manga.is_deleted || 0,
            is_draft: manga.is_draft || 0,
            is_published: manga.is_published || 0
          })),
          total: Number(pagination.total) || mangas.length,
          page: Number(pagination.page) || 1,
          limit: Number(pagination.limit) || 20,
          totalPages: Number(pagination.totalPages) || 1
        };
      },
      providesTags: (result) =>
        result?.mangas
          ? [
              ...result.mangas.map(({ manga_id }) => ({
                type: 'MangaAdmin' as const,
                id: manga_id
              })),
              { type: 'MangaList' as const, id: 'LIST' }
            ]
          : [{ type: 'MangaList' as const, id: 'LIST' }]
    }),

    getListFavManga: builder.query<MangaFavDetail[], void>({
      query: () => ({
        url: '/favorite/manga-from-favorite'
      }),
      transformResponse: (response: ApiResponse<MangaFavDetail[]>) => {
        if (!response.metadata || !Array.isArray(response.metadata)) {
          return [];
        }
        return response.metadata;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ manga_id }) => ({
                type: 'Favorite' as const,
                id: manga_id
              })),
              { type: 'Favorite' as const, id: 'LIST' }
            ]
          : [{ type: 'Favorite' as const, id: 'LIST' }]
    }),

    addFavorite: builder.mutation<MangaFav, number>({
      query: (mangaId) => {
        // Create URLSearchParams for x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('manga_id', String(mangaId));

        return {
          url: '/favorite/manga-to-favorite',
          method: 'POST',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      },
      transformResponse: (response: ApiResponse<MangaFav>) => {
        if (!response.metadata) {
          throw new Error('Failed to add Favorite');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, manga_id) => [
        { type: 'Favorite', id: manga_id },
        { type: 'Favorite', id: 'LIST' }
      ]
    }),

    // Remove manga from favorites
    removeFavorite: builder.mutation<{ success: boolean }, number>({
      query: (mangaId) => {
        // Create URLSearchParams for x-www-form-urlencoded
        const params = new URLSearchParams();
        params.append('manga_id', String(mangaId));

        return {
          url: '/favorite/manga-from-favorite',
          method: 'DELETE',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      },
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status
        };
      },
      invalidatesTags: (result, error, manga_id) => [
        { type: 'Favorite', id: manga_id },
        { type: 'Favorite', id: 'LIST' }
      ]
    }),

    createComment: builder.mutation<
      Comment,
      {
        comment_chapter_id: number;
        comment_content: string;
        comment_parent_id?: number | null;
      }
    >({
      query: ({ comment_chapter_id, comment_content, comment_parent_id }) => {
        const body: {
          comment_chapter_id: number;
          comment_content: string;
          comment_parent_id?: number;
        } = {
          comment_chapter_id,
          comment_content
        };

        // Only add comment_parent_id to body if it's not null or undefined
        if (comment_parent_id !== null && comment_parent_id !== undefined) {
          body.comment_parent_id = comment_parent_id;
        }

        return {
          url: '/comment',
          method: 'POST',
          body
        };
      },
      transformResponse: (response: ApiResponse<Comment>) => {
        if (!response.metadata) {
          throw new Error('Failed to create comment');
        }
        return response.metadata;
      },
      invalidatesTags: (result, error, { comment_chapter_id }) => [
        { type: 'Chapter', id: `MANGA_${comment_chapter_id}` }
      ]
    }),

    getListComments: builder.query<
      Comment[],
      { chapter_id: number; parent_id?: number | null }
    >({
      query: ({ chapter_id, parent_id }) => {
        // If parent_id is provided, we can add it as a query parameter
        const searchParam = new URLSearchParams();
        searchParam.append('chapterId', String(chapter_id));
        if (parent_id !== undefined && parent_id !== null) {
          searchParam.append('parentId', String(parent_id));
        }

        return {
          url: `/comment?${searchParam.toString()}`
        };
      },
      transformResponse: (response: ApiResponse<Comment[]>) => {
        if (!response.metadata || !Array.isArray(response.metadata)) {
          return [];
        }
        return response.metadata;
      },
      providesTags: (result, error, { chapter_id }) => [
        { type: 'Chapter', id: `MANGA_${chapter_id}` }
      ]
    }),

    updateUserProfile: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      { userId: number; data: FormData }
    >({
      query: ({ userId, data }) => ({
        url: `/user/update-profile `,
        method: 'PATCH',
        body: data,
        formData: true
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User', id: userId }
      ]
    }),

    getUserProfile: builder.query<User, number>({
      query: (userId) => ({
        url: `/user/${userId}`
      }),
      transformResponse: (response: ApiResponse<User>) => {
        if (!response.metadata) {
          throw new Error('Failed to fetch user profile');
        }
        return response.metadata;
      },
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }]
    }),

    getUserAvatar: builder.query<Avatar, number>({
      query: (userId) => ({
        url: `/user/${userId}`
      }),
      transformResponse: (response: ApiResponse<User>) => {
        if (!response.metadata) {
          throw new Error('Failed to fetch user profile');
        }
        return {
          usr_avatar: response.metadata.usr_avatar || ''
        };
      },
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }]
    }),

    // Add more endpoints as needed
    getContractAddress: builder.query<CIDStorage, void>({
      query: () => ({
        url: '/manga/contract-address/cid-storage'
      }),
      transformResponse: (response: ApiResponse<CIDStorage>) => {
        if (!response.metadata) {
          throw new Error('Failed to fetch contract address');
        }
        return response.metadata;
      }
    }),

    increaseMangaView: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        mangaId: number;
      }
    >({
      query: ({ mangaId }) => ({
        url: `/manga/views/${mangaId}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      }
    }),

    increaseChapterView: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        chapterId: number;
      }
    >({
      // Corrected query function syntax
      query: ({ chapterId }) => ({
        url: `/chapter/views/${chapterId}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      }
      // No need to invalidate tags for chapter views
    }),

    ratingManga: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      {
        mangaId: number;
        rating: number;
      }
    >({
      query: ({ mangaId, rating }) => ({
        url: `/manga/rating/${mangaId}?rating=${rating}`,
        method: 'PATCH'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status,
          message: response.message
        };
      },
      invalidatesTags: (result, error, { mangaId }) => [
        { type: 'MangaAdmin', id: mangaId }
      ]
    }),

    deleteComment: builder.mutation<
      {
        success: boolean;
      },
      number
    >({
      query: (commentId) => ({
        url: `/comment/${commentId}`,
        method: 'DELETE'
      }),
      transformResponse: (response: ApiResponse<null>) => {
        return {
          success: response.status
        };
      }
    })
  })
});

// Export hooks for usage in functional components
export const {
  useGetAllMangaQuery,
  useGetMangaByIdQuery,
  useGetMangaByCategoryQuery,
  useSearchMangaQuery,
  useCreateMangaMutation,
  useUpdateMangaByIdMutation,
  usePublishMangaMutation,
  useUnpublishMangaMutation,
  useDeleteMangaMutation,
  useGetMangaChaptersQuery,
  useGetChapterDetailQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
  useDeleteImageInChapterMutation,
  useGetListFavMangaQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useCreateCommentMutation,
  useGetListCommentsQuery,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useGetContractAddressQuery,
  useIncreaseMangaViewMutation,
  useIncreaseChapterViewMutation,
  useRatingMangaMutation,
  useUpdateMangaCategoriesMutation,
  useGetUserAvatarQuery,
  useDeleteCommentMutation
} = mangaApi;
