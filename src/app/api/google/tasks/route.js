import { getServerSession } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const scopes = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/tasks.readonly'
].join(' ');

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: scopes,
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    }
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const res = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: 'Google API error', details: text }), { status: 500 });
    }

    const data = await res.json();
    const tasks = (data.items || []).map(t => ({
      id: t.id,
      title: t.title,
      due: t.due,
      status: t.status,
      updated: t.updated
    }));

    return new Response(JSON.stringify({ tasks }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error', details: e.message }), { status: 500 });
  }
}