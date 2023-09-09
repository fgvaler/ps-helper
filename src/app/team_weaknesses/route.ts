
import { NextResponse } from 'next/server'
import { get_weaknesses } from '@/lib/weaknesses';
import { import_team } from '@/lib/utils';

export async function POST(request: Request) {
    const request_body = await request.json();
    const team = import_team(request_body['team']);   
    const weaknesses = get_weaknesses(team);
    return NextResponse.json(weaknesses);
};
