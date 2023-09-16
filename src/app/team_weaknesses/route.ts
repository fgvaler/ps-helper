
import { NextResponse } from 'next/server'
import { getWeaknesses } from '@/lib/weaknesses';
import { importTeam } from '@/lib/utils';

export async function POST(request: Request) {
    const request_body = await request.json();
    const team = importTeam(request_body['team']);   
    const weaknesses = getWeaknesses(team);
    return NextResponse.json(weaknesses);
};
