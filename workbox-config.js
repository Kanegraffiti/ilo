module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{js,css,html,svg,png,webp,ico}'],
  swSrc: 'workers/service-worker.js',
  swDest: 'public/sw.js',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};
