// components/SessionProviderWrapper.tsx
'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
type LayoutProps = {
  children: ReactNode;
  session?: Session | null;
};

export default function SessionProviderWrapper({
  children,
  session,
}: LayoutProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
