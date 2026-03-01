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

    const { data: brands, errors } = await client.models.Brands.list({
      authMode: 'identityPool',
    });

    if (errors) {
      console.error('Error fetching brands:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch brands', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ brands: brands || [] });
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

    // バリデーション
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        { error: 'ブランド名は必須項目です' },
        { status: 400 }
      );
    }

    const { data: brand, errors } = await client.models.Brands.create({
      name: body.name.trim(),
      name_kana: body.name_kana?.trim() || null,
      description: body.description?.trim() || null,
      birth_place: body.birth_place?.trim() || null,
      found_year: body.found_year ? parseInt(body.found_year, 10) : null,
    }, {
      authMode: 'userPool',
    });

    if (errors) {
      console.error('Error creating brand:', errors);
      return NextResponse.json(
        { error: 'ブランドの登録に失敗しました', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
