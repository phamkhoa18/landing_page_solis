import { NextRequest, NextResponse } from 'next/server'
import Vcard from '../../../../../../models/Vcard';
import connectDB from '../../../../../../lib/mongodb';

// Tắt bodyParser của Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Await params to get the slug
  await connectDB();

  const vcard = await Vcard.findOne({ slug });

  if (!vcard) {
    return NextResponse.json({ error: 'No user' }, { status: 404 });
  }

  return NextResponse.json(vcard, { status: 200 });
}