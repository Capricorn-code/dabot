import { NextResponse } from 'next/server';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { cookies } from 'next/headers';
import outputs from '@/amplify_outputs.json';
import type { Schema } from '@/amplify/data/resource';

const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get authenticated user ID from session
    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });

    const userId = session.tokens?.accessToken
      ? session.identityId ?? null
      : null;

    if (!userId) {
      return NextResponse.json({ storeIds: [], brandIds: [], userId: null });
    }

    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    const { data: favorites, errors } = await client.models.Favorites.list();

    if (errors || !favorites) {
      return NextResponse.json({ storeIds: [], brandIds: [], userId });
    }

    const storeIds = favorites
      .filter(f => f.target_type === 'store')
      .map(f => f.target_id);

    const brandIds = favorites
      .filter(f => f.target_type === 'brand')
      .map(f => f.target_id);

    return NextResponse.json({ storeIds, brandIds, userId });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ storeIds: [], brandIds: [], userId: null });
  }
}
