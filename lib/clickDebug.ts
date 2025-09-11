export function enableClickDebug() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_DEBUG_CLICKS) return;
  const handler = (e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    if (!el) return;
    console.log('Clicked:', el.tagName, el.className);
    el.animate([{ outline: '3px solid #f59e0b' }, { outline: 'none' }], { duration: 600 });
  };
  document.addEventListener('click', handler);
}
