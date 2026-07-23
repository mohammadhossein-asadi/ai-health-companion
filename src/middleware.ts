import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

export const config = {
  matcher: [
    '/log/:path*',
    '/profile/:path*',
    '/api/analyze-health/:path*',
  ],
};
