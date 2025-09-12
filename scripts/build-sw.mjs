#!/usr/bin/env node
import { injectManifest } from 'workbox-build';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const config = require('../workbox-config.js');

try {
  const { count, size, warnings } = await injectManifest(config);
  warnings.forEach((w) => console.warn(w));
  console.log(`Generated ${config.swDest}, which will precache ${count} files, totaling ${size} bytes.`);
} catch (err) {
  console.error('Service worker build failed:', err);
  process.exit(1);
}
