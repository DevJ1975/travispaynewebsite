import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// On-demand ISR (doc 05 §3.3). Called after publish to refresh blog pages.
export async function POST(request: NextRequest) {
  const provided =
    request.nextUrl.searchParams.get('secret') ?? request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || provided !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path');
  if (path) revalidatePath(path);
  revalidatePath('/blog');

  return NextResponse.json({ revalidated: true, path: path ?? '/blog' });
}
