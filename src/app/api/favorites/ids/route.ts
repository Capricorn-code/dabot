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

    const { data: favorites, errors } = await client.models.Favorites.list();

    if (errors || !favorites) {
      return NextResponse.json({ storeIds: [], brandIds: [] });
    }

    const storeIds = favorites
      .filter(f => f.target_type === 'store')
      .map(f => f.target_id);

    const brandIds = favorites
      .filter(f => f.target_type === 'brand')
      .map(f => f.target_id);

    // Also return user_id for delete operations
    const userId = favorites.length > 0 ? favorites[0].user_id : null;

    return NextResponse.json({ storeIds, brandIds, userId });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ storeIds: [], brandIds: [], userId: null });
  }
}
