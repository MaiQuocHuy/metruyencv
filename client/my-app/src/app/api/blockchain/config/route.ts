import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the cookie store
    const cookieStore = await cookies();

    // Access cookies from the store
    const JsonaccessToken = cookieStore.get('access_token')?.value;
    const x_client_id = cookieStore.get('x-client-id')?.value;

    if (!JsonaccessToken) {
      throw new Error('Missing access');
    }
    const accessToken = JSON.parse(JsonaccessToken);

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/manga/contract-address/cid-storage`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-client-id': x_client_id || ''
        }
      }
    );

    const responseData = await result.json();

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error providing blockchain config:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve blockchain configuration' },
      { status: 500 }
    );
  }
}
