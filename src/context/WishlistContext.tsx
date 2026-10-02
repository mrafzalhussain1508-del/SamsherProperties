'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Property } from '@/types/property';
import { INITIAL_PROPERTIES } from '@/data/mockProperties';

interface ToastState {
  id: number;
  message: string;
  propertyTitle?: string;
  isAdded: boolean;
}

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProperties: Property[];
  wishlistCount: number;
  isWishlisted: (propertyId: string) => boolean;
  toggleWishlist: (property: Property) => void;
  addToWishlist: (property: Property) => void;
  removeFromWishlist: (propertyId: string) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toast: ToastState | null;
  dismissToast: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'samsher_wishlist_v1';
const PROPERTIES_STORAGE_KEY = 'samsher_properties_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [availableProperties, setAvailableProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  // Load properties pool from localStorage (dynamically added properties + initial properties)
  const refreshPropertiesPool = useCallback(() => {
    try {
      const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableProperties(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error reading properties from storage for wishlist:', e);
    }
    setAvailableProperties(INITIAL_PROPERTIES);
  }, []);

  // Initialize wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch (e) {
      console.error('Error reading wishlist from storage:', e);
    }

    refreshPropertiesPool();

    // Listen to custom properties updated events
    const handlePropsUpdated = () => refreshPropertiesPool();
    window.addEventListener('samsher_properties_updated', handlePropsUpdated);

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setWishlistIds(parsed);
        } catch {}
      }
      if (e.key === PROPERTIES_STORAGE_KEY) {
        refreshPropertiesPool();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('samsher_properties_updated', handlePropsUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshPropertiesPool]);

  // Persist wishlist changes to localStorage
  const saveWishlist = useCallback((newIds: string[]) => {
    setWishlistIds(newIds);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newIds));
    } catch (e) {
      console.error('Error saving wishlist to storage:', e);
    }
  }, []);

  const showToast = useCallback((message: string, propertyTitle: string, isAdded: boolean) => {
    setToast({
      id: Date.now(),
      message,
      propertyTitle,
      isAdded,
    });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast after 3.5s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const isWishlisted = useCallback((propertyId: string) => {
    return wishlistIds.includes(propertyId);
  }, [wishlistIds]);

  const addToWishlist = useCallback((property: Property) => {
    if (!wishlistIds.includes(property.id)) {
      const next = [property.id, ...wishlistIds];
      saveWishlist(next);
      showToast('Saved to your collection', property.title, true);
    }
  }, [wishlistIds, saveWishlist, showToast]);

  const removeFromWishlist = useCallback((propertyId: string) => {
    const next = wishlistIds.filter((id) => id !== propertyId);
    const removedProp = availableProperties.find((p) => p.id === propertyId);
    saveWishlist(next);
    showToast('Removed from collection', removedProp ? removedProp.title : 'Property', false);
  }, [wishlistIds, availableProperties, saveWishlist, showToast]);

  const toggleWishlist = useCallback((property: Property) => {
    if (wishlistIds.includes(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  }, [wishlistIds, removeFromWishlist, addToWishlist]);

  const clearWishlist = useCallback(() => {
    saveWishlist([]);
    showToast('All saved residences cleared', '', false);
  }, [saveWishlist, showToast]);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  // Compute matched property objects for wishlisted IDs
  const wishlistProperties = useMemo(() => {
    const propertyMap = new Map(availableProperties.map((p) => [p.id, p]));
    return wishlistIds
      .map((id) => propertyMap.get(id))
      .filter((p): p is Property => Boolean(p));
  }, [wishlistIds, availableProperties]);

  const wishlistCount = wishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProperties,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        toast,
        dismissToast,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
