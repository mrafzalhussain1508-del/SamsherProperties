'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import AgentAuthModal from '@/components/AgentAuthModal';
import WishlistDrawer from '@/components/WishlistDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        {children}
        <AgentAuthModal />
        <WishlistDrawer />
      </WishlistProvider>
    </AuthProvider>
  );
}
