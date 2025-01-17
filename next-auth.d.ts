import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string; // Add the `id` property to match the `User` interface requirements
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string; // Add `accessToken` for your custom needs
    };
  }

  interface User {
    id: string; // Ensure `id` is present in the `User` interface
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string; // Add `accessToken` for custom needs
  }
}