import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import connectDB from '@/config/db';
import User from '@/models/User';
import { loginSchema } from '@/validators/auth';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = loginSchema.safeParse(credentials);
          
          if (!parsedCredentials.success) {
            return null;
          }
          
          const { email, password } = parsedCredentials.data;
          
          await connectDB();
          const user = await User.findOne({ email });
          
          if (!user || user.provider !== 'credentials' || !user.password) {
            return null;
          }
          
          const passwordsMatch = await bcryptjs.compare(password, user.password);
          
          if (passwordsMatch) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        console.log('=== GOOGLE LOGIN DATA ===');
        console.log('User:', user);
        console.log('Account:', account);
        console.log('Profile:', profile);
        console.log('===========================');
        
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              role: 'user',
            });
          }
          return true;
        } catch (error) {
          console.error('Error saving Google user', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
