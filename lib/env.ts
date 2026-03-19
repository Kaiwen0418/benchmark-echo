type EnvKey =
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  | 'SUPABASE_SERVICE_ROLE_KEY'
  | 'SUPABASE_DB_URL'
  | 'SUPABASE_JWT_SECRET'
  | 'SUPABASE_STORAGE_BUCKET_UPLOADS'
  | 'SUPABASE_STORAGE_BUCKET_REPORTS'
  | 'SUPABASE_STORAGE_BUCKET_FIXTURES'
  | 'APP_BASE_URL'
  | 'ENABLE_SUPABASE_PERSISTENCE';

function readEnv(key: EnvKey) {
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function requiredEnv(key: EnvKey) {
  const value = readEnv(key);

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function booleanEnv(key: EnvKey, fallback: boolean) {
  const value = readEnv(key);

  if (!value) {
    return fallback;
  }

  return value === 'true';
}

export const appEnv = {
  appBaseUrl: readEnv('APP_BASE_URL') ?? 'http://localhost:3000',
  enableSupabasePersistence: booleanEnv('ENABLE_SUPABASE_PERSISTENCE', false)
};

export const supabaseEnv = {
  url: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
  dbUrl: readEnv('SUPABASE_DB_URL'),
  jwtSecret: readEnv('SUPABASE_JWT_SECRET'),
  storage: {
    uploads: readEnv('SUPABASE_STORAGE_BUCKET_UPLOADS') ?? 'benchmark-uploads',
    reports: readEnv('SUPABASE_STORAGE_BUCKET_REPORTS') ?? 'benchmark-reports',
    fixtures: readEnv('SUPABASE_STORAGE_BUCKET_FIXTURES') ?? 'benchmark-fixtures'
  }
};

export function hasSupabasePublicEnv() {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}

export function hasSupabaseServerEnv() {
  return Boolean(supabaseEnv.dbUrl && supabaseEnv.serviceRoleKey);
}

export function assertSupabasePersistenceEnv() {
  if (!appEnv.enableSupabasePersistence) {
    return;
  }

  requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  requiredEnv('SUPABASE_DB_URL');
}
