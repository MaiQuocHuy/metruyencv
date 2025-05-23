import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isTokenExpired } from '@/lib/utils';
import Cookies from 'js-cookie';

// Define types for our state
interface User {
  id: string;
  name: string;
  email: string;
}

export interface TokenType {
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: User | null;
  tokens: TokenType | null;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  clientId: string | null;
}

// Define the initial state without accessing cookies
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isTokenExpired: false,
  clientId: null
};

function SECURE_COOKIE_OPTIONS(expires: number = 7) {
  return {
    expires,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  };
}

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; tokens: TokenType }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isTokenExpired = false;
      state.clientId = action.payload.user.id;

      // Save data to cookies for persistence
      if (typeof window !== 'undefined') {
        Cookies.set(
          'access_token',
          JSON.stringify(action.payload.tokens.access_token),
          SECURE_COOKIE_OPTIONS(2)
        );
        Cookies.set(
          'refresh_token',
          JSON.stringify(action.payload.tokens.refresh_token),
          SECURE_COOKIE_OPTIONS(7)
        );
        Cookies.set(
          'x-client-id',
          action.payload.user.id,
          SECURE_COOKIE_OPTIONS()
        );
      }
    },

    checkTokenExpiration: (state) => {
      if (
        state.tokens?.access_token &&
        isTokenExpired(state.tokens.access_token)
      ) {
        state.isTokenExpired = true;
      }
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.tokens = null;
      state.isTokenExpired = false;
      state.clientId = null;

      // Remove cookies
      if (typeof window !== 'undefined') {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('x-client-id');
        //  When remove cookies successfully direct to login page
        window.location.href = '/login';
      }
    },

    getUserCurrent: (state) => {
      const clientId = Cookies.get('x-client-id') ?? null;

      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');

      if (clientId) state.clientId = clientId;

      // Only update tokens if both values exist
      if (accessToken && refreshToken) {
        state.tokens = {
          access_token: JSON.parse(accessToken),
          refresh_token: JSON.parse(refreshToken)
        };

        // You might want to update authentication state too
        state.isAuthenticated = true;
        state.isTokenExpired = isTokenExpired(JSON.parse(accessToken));
      }
    }
  }
});

// Export actions and reducer
export const { loginSuccess, logout, checkTokenExpiration, getUserCurrent } =
  authSlice.actions;

export default authSlice.reducer;
