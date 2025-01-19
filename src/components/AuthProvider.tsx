import React, { useEffect } from 'react';
import { supabase, isDevelopment } from '../lib/supabase';
import { useStore } from '../store/useStore';

// Development admin user
const DEV_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  displayName: 'Admin User',
  level: 99,
  totalXp: 9999
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setError } = useStore();

  useEffect(() => {
    if (isDevelopment) {
      // In development, automatically set the admin user
      setUser(DEV_USER);
      return;
    }

    // Production authentication logic
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || null,
          level: 1,
          totalXp: 0
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || null,
          level: 1,
          totalXp: 0
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}