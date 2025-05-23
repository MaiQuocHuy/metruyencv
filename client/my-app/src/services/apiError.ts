import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/lib/redux/store'; // Assuming store is in lib/redux

const apiBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState; // Use RootState for type safety
    const token = state.auth?.tokens;
    const clientId = state.auth?.clientId;

    if (token?.access_token) {
      headers.set('Authorization', `Bearer ${token.access_token}`);
      if (clientId != null) {
        headers.set('x-client-id', String(clientId));
      }
    }
    return headers;
  }
});

// --- Type Definitions ---

// Use a const object for better type safety and autocompletion
export const REPORT_KIND = {
  ERROR_IMAGES: 'error-image',
  DUPLICATE_CHAPTER: 'duplicate-chapter',
  NOT_TRANSLATED: 'chapter-not-translated-yet',
  OTHER: 'other'
} as const;

export type ReportKind = (typeof REPORT_KIND)[keyof typeof REPORT_KIND];

export interface ErrorReport {
  report_id: number;
  report_user_id: number; // Should be handled by backend based on auth
  report_chapter_id: number;
  report_description: string;
  report_kind_of_error: ReportKind;
  is_fixed: boolean;
  updatedAt: string; // ISO date string
  createdAt: string; // ISO date string
}

interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiOptions {
  pagination?: PaginationOptions;
  [key: string]: any; // Allow other properties if structure varies
}

// Generic API Response Wrapper
interface ApiResponse<T> {
  status: boolean; // Consider using statusCode directly
  path: string;
  statusCode: number;
  statusReason: string;
  message: string;
  metadata: T;
  option?: ApiOptions;
  timestamp: string; // ISO date string
}

// Specific type for Admin view of errors
export interface ErrorAdmin extends ErrorReport {
  is_deleted: boolean;
  report_admin_id: number | null;
  chapter: {
    chap_number: number;
    chap_title: string;
    manga: {
      manga_title: string;
    };
  };
}

// Specific type for detailed view of an error
export interface ErrorAdminDetail extends ErrorReport {
  is_deleted: boolean;
  report_admin_id: number | null;
  UserReportError: {
    usr_id: number;
    usr_name: string;
  };
  AdminManageError: {
    usr_id: number;
    usr_name: string;
  } | null;
}

// Type for the transformed response of getErrors
interface PaginatedErrors {
  errors: ErrorAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query parameters for fetching errors
export interface ErrorQueryParams {
  page?: number;
  limit?: number;
  isFixed?: string;
  isManaged?: string; // Renamed from isMangage for clarity
}

// --- API Definition ---

export const errorApiSlice = createApi({
  reducerPath: 'errorApi', // Use camelCase for reducerPath
  baseQuery: apiBaseQuery,
  tagTypes: ['Error'],
  endpoints: (builder) => ({
    // Mutation to create a new error report
    createReport: builder.mutation<ErrorReport, Partial<ErrorReport>>({
      query: (report) => {
        // Convert the report object to URLSearchParams
        const body = new URLSearchParams();
        Object.entries(report).forEach(([key, value]) => {
          // Ensure values are strings; handle potential undefined/null if necessary
          if (value !== undefined && value !== null) {
            body.append(key, String(value));
          }
        });

        return {
          url: '/error-report',
          method: 'POST',
          body: body, // Send the URLSearchParams object
          headers: {
            // Set the Content-Type header specifically for this request
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
      },
      // Invalidate the list cache when a new report is created
      invalidatesTags: [{ type: 'Error', id: 'LIST' }]
    }),

    // Query to get a paginated list of errors with filtering
    getErrors: builder.query<PaginatedErrors, ErrorQueryParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        // Set default values directly in append if param is undefined
        queryParams.append('page', String(params.page ?? 1));
        queryParams.append('limit', String(params.limit ?? 20));
        // Only append boolean params if they are explicitly provided
        if (params.isFixed !== undefined) {
          queryParams.append('isFixed', String(params.isFixed));
        }
        if (params.isManaged !== undefined) {
          // Use the corrected parameter name 'isManaged'
          queryParams.append('isManaged', String(params.isManaged));
        }
        return {
          url: `/error-report/reports?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      // Transform the raw API response into the desired PaginatedErrors structure
      transformResponse: (
        response: ApiResponse<ErrorAdmin[]>
      ): PaginatedErrors => {
        const defaultResponse: PaginatedErrors = {
          errors: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 1
        };

        if (
          !response ||
          response.statusCode >= 400 ||
          !response.metadata ||
          !Array.isArray(response.metadata)
        ) {
          console.log('Failed to fetch errors or invalid format:', response);
          return defaultResponse; // Return default on error or invalid data
        }

        const errors = response.metadata;
        const pagination = response.option?.pagination;

        return {
          errors,
          total: pagination?.total ?? errors.length,
          page: pagination?.page ?? 1,
          limit: pagination?.limit ?? 20,
          totalPages:
            pagination?.totalPages ??
            Math.ceil(
              (pagination?.total ?? errors.length) / (pagination?.limit ?? 20)
            )
        };
      },
      // Provide cache tags for the fetched data
      providesTags: (result) =>
        result
          ? [
              // Tag for each individual error item
              ...result.errors.map(({ report_id }) => ({
                type: 'Error' as const,
                id: report_id
              })),
              // Tag for the list itself, potentially including query params for granularity
              { type: 'Error', id: 'LIST' }
            ]
          : [{ type: 'Error', id: 'LIST' }] // Fallback tag
    }),

    // Mutation to mark an error as fixed
    fixError: builder.mutation<ErrorReport, number>({
      query: (report_id) => ({
        url: `/error-report/fix/${report_id}`,
        method: 'PATCH'
      }),
      // Invalidate the specific error and the list upon success
      invalidatesTags: (_result, error, report_id) =>
        error
          ? []
          : [
              { type: 'Error', id: report_id },
              { type: 'Error', id: 'LIST' }
            ]
    }),

    // Mutation for an admin to manage/assign an error
    manageError: builder.mutation<ErrorReport, number>({
      query: (report_id) => ({
        url: `/error-report/manage/${report_id}`,
        method: 'PATCH'
      }),
      invalidatesTags: (_result, error, report_id) =>
        error
          ? []
          : [
              { type: 'Error', id: report_id },
              { type: 'Error', id: 'LIST' }
            ]
    }),

    // Mutation to delete an error report
    deleteError: builder.mutation<{ success: boolean; id: number }, number>({
      query: (report_id) => ({
        url: `/error-report/${report_id}`,
        method: 'DELETE'
      }),
      // Invalidate the specific error and the list upon successful deletion
      invalidatesTags: (_result, error, report_id) =>
        error
          ? []
          : [
              { type: 'Error', id: report_id },
              { type: 'Error', id: 'LIST' }
            ]
    }),

    // Query to get details for a specific error by its ID
    getErrorById: builder.query<ErrorAdminDetail, number>({
      query: (report_id) => `/error-report/reports/${report_id}`,
      transformResponse: (
        response: ApiResponse<ErrorAdminDetail>
      ): ErrorAdminDetail => {
        if (!response || response.statusCode >= 400 || !response.metadata) {
          // Throw an error to be handled by the component's error state
          throw new Error(response?.message || 'Error report not found');
        }
        return response.metadata;
      },
      // Provide a cache tag for the specific error ID
      providesTags: (_result, _error, report_id) => [
        { type: 'Error', id: report_id }
      ]
    })
  })
});

// Export hooks generated by RTK Query for usage in components
export const {
  useCreateReportMutation,
  useGetErrorsQuery,
  useFixErrorMutation,
  useManageErrorMutation,
  useDeleteErrorMutation,
  useGetErrorByIdQuery
} = errorApiSlice;

// Optional: export the api instance itself if needed elsewhere
export default errorApiSlice;
