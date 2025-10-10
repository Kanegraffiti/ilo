#!/usr/bin/env node
import process from 'node:process';

const required = [
  { primary: 'NEXT_PUBLIC_SUPABASE_URL', fallbacks: ['SUPABASE_URL'] },
  { primary: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', fallbacks: ['SUPABASE_ANON_KEY'] },
];

const missing = [];
const usingFallback = [];

for (const { primary, fallbacks } of required) {
  if (process.env[primary]) {
    continue;
  }

  const fallback = fallbacks.find((key) => process.env[key]);
  if (fallback) {
    usingFallback.push(`${primary} ← ${fallback}`);
  } else {
    missing.push(primary);
  }
}

if (missing.length) {
  const message = `Missing required environment variables: ${missing.join(', ')}`;
  if (process.env.VERCEL) {
    console.warn(message);
  } else {
    console.error(message);
    process.exit(1);
  }
}

if (usingFallback.length) {
  console.info(`Using fallback environment variables: ${usingFallback.join(', ')}`);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not set; server-side features may not work.');
}
