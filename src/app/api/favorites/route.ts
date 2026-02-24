import { NextResponse, NextRequest } from 'next/server';
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

    if (errors) {
      console.error('Error fetching favorites:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch favorites', details: errors },
        { status: 500 }
      );
    }

    if (!favorites || favorites.length === 0) {
      return NextResponse.json({ stores: [], brands: [] });
    }

    const storeFavorites = favorites.filter(f => f.target_type === 'store');
    const brandFavorites = favorites.filter(f => f.target_type === 'brand');

    const storeResults = await Promise.all(
      storeFavorites.map(async (fav) => {
        const { data: store } = await client.models.Stores.get({ id: fav.target_id });
        if (!store) return null;
        return {
          favoriteKey: { user_id: fav.user_id, target_type: fav.target_type, target_id: fav.target_id },
          id: store.id,
          name: store.name,
          area: store.area,
          address: store.address,
        };
      })
    );

    const brandResults = await Promise.all(
      brandFavorites.map(async (fav) => {
        const { data: brand } = await client.models.Brands.get({ id: fav.target_id });
        if (!brand) return null;
        return {
          favoriteKey: { user_id: fav.user_id, target_type: fav.target_type, target_id: fav.target_id },
          id: brand.id,
          name: brand.name,
          name_kana: brand.name_kana,
        };
      })
    );

    return NextResponse.json({
      stores: storeResults.filter(Boolean),
      brands: brandResults.filter(Boolean),
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    const body = await request.json();
    const { user_id, target_type, target_id } = body;

    if (!user_id || !target_type || !target_id) {
      return NextResponse.json(
        { error: 'user_id, target_type, target_id are required' },
        { status: 400 }
      );
    }

    const { data: favorite, errors } = await client.models.Favorites.create({
      user_id,
      target_type,
      target_id,
    });

    if (errors) {
      console.error('Error creating favorite:', errors);
      return NextResponse.json(
        { error: 'Failed to create favorite', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    const body = await request.json();
    const { user_id, target_type, target_id } = body;

    if (!user_id || !target_type || !target_id) {
      return NextResponse.json(
        { error: 'user_id, target_type, target_id are required' },
        { status: 400 }
      );
    }

    const { errors } = await client.models.Favorites.delete({
      user_id,
      target_type,
      target_id,
    });

    if (errors) {
      console.error('Error deleting favorite:', errors);
      return NextResponse.json(
        { error: 'Failed to delete favorite', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
