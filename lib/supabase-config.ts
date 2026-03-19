import { appEnv, assertSupabasePersistenceEnv, hasSupabasePublicEnv, hasSupabaseServerEnv, supabaseEnv } from '@/lib/env';

export type PersistenceMode = 'memory' | 'supabase';

export function getPersistenceMode(): PersistenceMode {
  if (appEnv.enableSupabasePersistence) {
    assertSupabasePersistenceEnv();
    return 'supabase';
  }

  return 'memory';
}

export function getSupabaseConfigSummary() {
  return {
    mode: getPersistenceMode(),
    hasPublicClientEnv: hasSupabasePublicEnv(),
    hasServerEnv: hasSupabaseServerEnv(),
    url: supabaseEnv.url ?? null,
    storageBuckets: supabaseEnv.storage
  };
}
