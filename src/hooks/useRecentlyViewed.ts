import { useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';

const RECENTLY_VIEWED_KEY = 'treelah_recently_viewed';
const MAX_RECENTLY_VIEWED = 12;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRecentlyViewed([]);
      }
    }
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    if (recentlyViewed.length > 0) {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists (to move it to the front)
      const filtered = prev.filter((id) => id !== productId);
      // Add to the front
      const updated = [productId, ...filtered];
      // Keep only the most recent items
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  }, []);

  const removeFromRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewed((prev) => {
      const updated = prev.filter((id) => id !== productId);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
  };
}

// Helper function to get product objects from IDs
export function getRecentlyViewedProducts(recentlyViewedIds: number[], products: Product[]): Product[] {
  return recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}
