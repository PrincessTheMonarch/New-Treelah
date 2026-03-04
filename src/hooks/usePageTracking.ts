import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from('page_views').insert({
        path: location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        user_id: user?.id ?? null,
      });
    };

    trackVisit();
  }, [location.pathname]);
}
