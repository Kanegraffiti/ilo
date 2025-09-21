/**
 * Flags direct use of problematic Tailwind utilities like text-white/text-black
 * unless paired with c-on-* classes. Keeps contrast safe.
 * Simple regex-based rule to avoid adding binaries.
 */
module.exports = {
  meta: { type: 'problem', docs: { description: 'Disallow unsafe hardcoded text colors' }, schema: [] },
  create(context) {
    const BAD = /\btext-(white|black|neutral-\d{2,3}|zinc-\d{2,3}|stone-\d{2,3})\b/;
    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        const value = node.value;
        if (
          BAD.test(value) &&
          !/c-on-(paper|surface-1|surface-2|surface-3|primary|secondary|accent)/.test(value)
        ) {
          context.report({ node, message: 'Use c-on-* tokens instead of hardcoded text-* color.' });
        }
      },
      TemplateElement(node) {
        const raw = node.value.raw;
        if (
          BAD.test(raw) &&
          !/c-on-(paper|surface-1|surface-2|surface-3|primary|secondary|accent)/.test(raw)
        ) {
          context.report({ node, message: 'Use c-on-* tokens instead of hardcoded text-* color.' });
        }
      },
    };
  },
};
