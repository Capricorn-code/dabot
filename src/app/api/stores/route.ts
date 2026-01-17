import { NextResponse } from 'next/server';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';
import outputs from '@/amplify_outputs.json';
import type { Schema } from '@/amplify/data/resource';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    const { data: stores, errors } = await client.models.Store.list();

    if (errors) {
      console.error('Error fetching stores:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch stores', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ stores: stores || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
