import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/dashboard/:path*', '/profile']
};

export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString();
    const payload = JSON.parse(decodedPayload);

    if (!payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTime + bufferSeconds;
  } catch (error) {
    console.log('Error checking token expiration:', error);
    return true;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const JsonaccessToken = request.cookies.get('access_token')?.value;
    const JsonrefreshToken = request.cookies.get('refresh_token')?.value;

    if (!JsonaccessToken || !JsonrefreshToken) {
      throw new Error('Missing access or refresh token');
    }

    const accessToken = JSON.parse(JsonaccessToken);
    const refreshToken = JSON.parse(JsonrefreshToken);

    if (!accessToken) {
      throw new Error('Invalid access token');
    }

    if (isTokenExpired(accessToken)) {
      if (!refreshToken || isTokenExpired(refreshToken)) {
        throw new Error('Refresh token expired or missing');
      }

      const response = await fetch(
        'http://localhost:8080/auth/handle-refresh-token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-refresh-key': refreshToken
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const responseData = await response.json();
      const newTokens = {
        access_token: responseData.metadata.token.access_token,
        refresh_token: responseData.metadata.token.refresh_token
      };

      const nextResponse = NextResponse.next();
      nextResponse.cookies.set({
        name: 'access_token',
        value: JSON.stringify(newTokens.access_token),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // i want to setting expire in 2 day
        maxAge: 2 * 24 * 60 * 60 // 2 days in seconds
      });

      nextResponse.cookies.set({
        name: 'refresh_token',
        value: JSON.stringify(newTokens.refresh_token),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // i want to setting expire in 7 day
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      });

      return nextResponse;
    }

    return NextResponse.next();
  } catch (error: any) {
    console.log('Error in middleware:', error.message);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}
