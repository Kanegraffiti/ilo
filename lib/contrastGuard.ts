export type ContrastBackground =
  | 'paper'
  | 'surface-1'
  | 'surface-2'
  | 'surface-3'
  | 'primary'
  | 'secondary'
  | 'accent';

export function defaultTextClassFor(
  containerBg: ContrastBackground,
):
  | 'c-on-paper'
  | 'c-on-surface-1'
  | 'c-on-surface-2'
  | 'c-on-surface-3'
  | 'c-on-primary'
  | 'c-on-secondary'
  | 'c-on-accent' {
  switch (containerBg) {
    case 'paper':
      return 'c-on-paper';
    case 'surface-1':
      return 'c-on-surface-1';
    case 'surface-2':
      return 'c-on-surface-2';
    case 'surface-3':
      return 'c-on-surface-3';
    case 'primary':
      return 'c-on-primary';
    case 'secondary':
      return 'c-on-secondary';
    case 'accent':
      return 'c-on-accent';
    default: {
      const neverBg: never = containerBg;
      throw new Error(`Unsupported background: ${neverBg}`);
    }
  }
}
