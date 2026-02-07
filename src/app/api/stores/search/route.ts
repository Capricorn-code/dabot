import { NextResponse } from 'next/server';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data';
import { cookies } from 'next/headers';
import outputs from '@/amplify_outputs.json';
import type { Schema } from '@/amplify/data/resource';

export const dynamic = 'force-dynamic';

type SearchParams = {
  keyword?: string;
  area?: string;
  prefecture?: string;
  brands?: string[];
};

export async function POST(request: Request) {
  try {
    const body: SearchParams = await request.json();
    const { keyword, area, prefecture, brands } = body;

    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });

    // ベースクエリ: すべての店舗を取得
    let { data: stores, errors } = await client.models.Store.list();

    if (errors) {
      console.error('Error fetching stores:', errors);
      return NextResponse.json(
        { error: 'Failed to fetch stores', details: errors },
        { status: 500 }
      );
    }

    if (!stores) {
      return NextResponse.json({ stores: [] });
    }

    // クライアント側でフィルタリング
    let filteredStores = stores;

    // キーワード検索
    if (keyword && keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      filteredStores = filteredStores.filter((store) => {
        return (
          store.name?.toLowerCase().includes(lowerKeyword) ||
          store.nameJa?.toLowerCase().includes(lowerKeyword) ||
          store.prefecture?.toLowerCase().includes(lowerKeyword) ||
          store.city?.toLowerCase().includes(lowerKeyword) ||
          store.address?.toLowerCase().includes(lowerKeyword) ||
          store.description?.toLowerCase().includes(lowerKeyword)
        );
      });
    }

    // エリアフィルター
    if (area && area !== 'all') {
      filteredStores = filteredStores.filter((store) => store.area === area);
    }

    // 都道府県フィルター
    if (prefecture) {
      filteredStores = filteredStores.filter(
        (store) => store.prefecture === prefecture
      );
    }

    // ブランドフィルター
    if (brands && brands.length > 0) {
      filteredStores = filteredStores.filter((store) => {
        if (!store.brands) return false;
        return brands.some((brand) => store.brands?.includes(brand));
      });
    }

    return NextResponse.json({ stores: filteredStores });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
