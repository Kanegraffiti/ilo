/**
 * Flags emoji characters in JSX text/strings to enforce using <Icon/> instead.
 * Lightweight regex; no native addons.
 */
const EMOJI_RE = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\uFE0F]/u;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow emojis in UI strings; use <Icon/> instead.' },
    schema: [],
  },
  create(ctx) {
    function check(node, value) {
      if (typeof value === 'string' && EMOJI_RE.test(value)) {
        ctx.report({ node, message: 'Replace emoji with themed <Icon /> component.' });
      }
    }
    return {
      Literal(node) {
        check(node, node.raw ?? node.value);
      },
      TemplateElement(node) {
        check(node, node.value.raw);
      },
      JSXText(node) {
        check(node, node.value);
      },
    };
  },
};
