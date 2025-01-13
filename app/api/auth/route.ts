import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client } from '../../lib/youtube';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    });
    return NextResponse.redirect(authUrl);
  } else {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return NextResponse.redirect('/');
  }
}
