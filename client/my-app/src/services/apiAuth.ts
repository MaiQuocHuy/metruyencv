import {
  BaseQueryMeta,
  BaseQueryResult,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react';
import { loginSuccess } from '@/lib/redux/slices/authSlice';

// Define types for our requests and responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface TokenType {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  usr_email: string;
  usr_password: string;
}

export interface RegisterRequest {
  usr_name: string;
  usr_email: string;
  usr_password: string;
}

// Updated to match the actual API response format
export interface ApiAuthResponse {
  status: boolean;
  statusCode: number;
  statusReason: string;
  message: string;
  timestamp: string;
  path: string;
  metadata: {
    tokens: {
      access_token: string;
      refresh_token: string;
    };
    user: {
      usr_id: number;
      usr_name: string;
      usr_email: string;
    };
  };
  option?: any;
}

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080'
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiAuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Data', data);
          const {
            metadata: {
              tokens: { access_token, refresh_token },
              user: { usr_id, usr_name, usr_email }
            }
          } = data;
          dispatch(
            loginSuccess({
              tokens: {
                access_token,
                refresh_token
              },
              user: {
                id: usr_id.toString(),
                name: usr_name,
                email: usr_email
              }
            })
          );
        } catch (error) {
          console.log('Error during login:', error);
        }
      }
    }),
    register: builder.mutation<ApiAuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/user/sign-up',
        method: 'POST',
        body: userData
      })
    }),

    refreshToken: builder.mutation<any, string>({
      query: (refresh_key: string) => ({
        url: '/auth/handle-refresh-token',
        method: 'POST',
        headers: {
          'x-refresh-key': refresh_key
        }
      }),
      transformResponse: (response: any) => {
        console.log('response', response);
        if (!response.metadata?.token) {
          throw new Error('Invalid token response');
        }
        return {
          access_token: response.metadata.token.access_token,
          refresh_token: response.metadata.token.refresh_token
        };
      }
    })
  })
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation
} = authApiSlice;
