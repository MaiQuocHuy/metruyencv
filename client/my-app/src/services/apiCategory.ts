// src/lib/redux/services/categoryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    const token = state.auth?.tokens;
    const clientId = state.auth?.clientId;
    // Set auth headers if token exists
    if (token?.access_token) {
      headers.set('Authorization', `Bearer ${token.access_token}`);
      // Use user ID if available
      headers.set('x-client-id', clientId);
    }
    return headers;
  }
});

// Define the API response format
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

// Define the Category interfaces
export interface Category {
  category_id: number;
  category_name: string;
  category_description?: string;
  createdAt?: string;
  updatedAt?: string;
  is_deleted?: boolean;
}

// Define response interfaces with proper nesting
interface CategoryResponse {
  category: Category;
}

interface CategoriesResponse {
  categories: Category[];
}

interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: apiBaseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/category',
      transformResponse: (
        response: ApiResponse<CategoriesResponse | Category[]>
      ) => {
        // Extract categories from response
        if (response?.metadata && 'categories' in response.metadata) {
          return response.metadata.categories;
        }

        // Handle case where API returns array directly in metadata
        if (Array.isArray(response.metadata)) {
          return response.metadata;
        }

        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: 'Category' as const,
                id: category.category_id
              })),
              { type: 'Category', id: 'LIST' }
            ]
          : [{ type: 'Category', id: 'LIST' }]
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `/category/${id}`,
      transformResponse: (
        response: ApiResponse<CategoryResponse | Category>
      ) => {
        // Extract category from response
        if (
          response?.metadata &&
          typeof response.metadata === 'object' &&
          'category' in response.metadata
        ) {
          return response.metadata.category;
        }

        // Handle case where API returns category directly in metadata
        if (
          response.metadata &&
          !Array.isArray(response.metadata) &&
          'category_id' in response.metadata
        ) {
          return response.metadata as Category;
        }

        throw new Error('Category not found');
      },
      providesTags: (result, error, id) => [{ type: 'Category', id }]
    }),

    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: '/category',
        method: 'POST',
        body: {
          category_name: newCategory.category_name,
          category_description: newCategory.category_description || ''
        }
      }),
      transformResponse: (
        response: ApiResponse<CategoryResponse | Category>
      ) => {
        // Extract the created category from the response
        if (
          response?.metadata &&
          typeof response.metadata === 'object' &&
          'category' in response.metadata
        ) {
          return response.metadata.category;
        }

        // Direct category object in metadata
        if (
          response?.metadata &&
          !Array.isArray(response.metadata) &&
          'category_id' in response.metadata
        ) {
          return response.metadata as Category;
        }

        throw new Error('Failed to create category. Invalid response format.');
      },
      invalidatesTags: [{ type: 'Category', id: 'LIST' }]
    }),

    updateCategory: builder.mutation<
      Category,
      Partial<Category> & Pick<Category, 'category_id'>
    >({
      query: ({ category_id, ...patch }) => ({
        url: '/category',
        method: 'PUT',
        params: { id: category_id },
        body: {
          ...patch
        }
      }),
      transformResponse: (response: ApiResponse<any>, _meta, arg) => {
        console.log('Update category response:', response);

        // If we have a response but no category data in it,
        // construct a category object from the request data
        // This ensures we return *something* of the correct type
        return {
          category_id: arg.category_id,
          category_name: arg.category_name || '',
          category_description: arg.category_description,
          updatedAt: new Date().toISOString()
        };
      },
      invalidatesTags: (result, error, { category_id }) => [
        { type: 'Category', id: category_id },
        { type: 'Category', id: 'LIST' }
      ]
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (categoryId) => ({
        url: '/category',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `listCategory=${categoryId}`
      }),
      invalidatesTags: (result, error, categoryId) => [
        { type: 'Category', id: categoryId },
        { type: 'Category', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoryApi;
