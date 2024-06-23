'use client';
import { createClient } from '@supabase/supabase-js';

// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    Clerk: any;
  }
}

function createClerkSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await window.Clerk.session?.getToken({
            template: 'supabase',
          });

          const headers = new Headers(options?.headers);
          headers.set('Authorization', `Bearer ${clerkToken}`);

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    },
  );
}

export const supabaseClient = createClerkSupabaseClient();
