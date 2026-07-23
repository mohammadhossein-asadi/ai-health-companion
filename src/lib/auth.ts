import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        mode: { label: 'Mode', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const mode = credentials.mode || 'signin';
        const email = credentials.email.toLowerCase();

        if (mode === 'signup') {
          // Check if user exists
          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) {
            throw new Error('An account with this email already exists');
          }

          // Create user
          const user = await prisma.user.create({
            data: {
              email,
              name: credentials.name || 'User',
              passwordHash: await bcrypt.hash(credentials.password, 10),
              healthData: {
                create: {},
              },
            },
            include: { healthData: true },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          // Sign in
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            throw new Error('No account found with this email');
          }

          const valid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!valid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
