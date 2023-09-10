
import { getNumber } from '@/lib/pokedex';
import { NextResponse } from 'next/server'

export async function GET() {
    const data = getNumber('Tauros-Paldea-Blaze');
    return NextResponse.json({ data });
}
