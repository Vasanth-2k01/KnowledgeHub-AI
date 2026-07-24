import { NextResponse } from 'next/server';
import { ensureCollection } from '@/lib/qdrant/client';

export async function GET() {
  try {
    // Attempt to connect and ensure the collection exists
    await ensureCollection();
    
    return NextResponse.json(
      { success: true, message: 'Qdrant connection successful and collection verified.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Qdrant test endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect to Qdrant' },
      { status: 500 }
    );
  }
}
