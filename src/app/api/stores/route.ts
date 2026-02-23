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

    const { data: stores, errors } = await client.models.Stores.list();

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

export async function POST(request: NextRequest) {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    const body = await request.json();

    // バリデーション
    const requiredFields = ['name', 'address', 'area', 'brand_number'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `${field} は必須項目です` },
          { status: 400 }
        );
      }
    }

    const { data: store, errors } = await client.models.Stores.create({
      name: body.name,
      address: body.address,
      area: body.area,
      is_open_now: body.is_open_now ?? true,
      phone_number: body.phone_number || null,
      brand_number: parseInt(body.brand_number, 10),
      display_brand_ids: body.display_brand_ids || [],
      review_count: body.review_count || null,
      description: body.description || null,
      site_url: body.site_url || null,
      business_hours: body.business_hours || null,
    });

    if (errors) {
      console.error('Error creating store:', errors);
      return NextResponse.json(
        { error: '店舗の登録に失敗しました', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
