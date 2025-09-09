import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ user: null, streak: 0, badges: [] });
}
