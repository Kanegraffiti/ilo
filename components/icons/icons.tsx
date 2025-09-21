import * as React from 'react';

export type IconName =
  | 'books'
  | 'party'
  | 'tortoise'
  | 'mic'
  | 'badge'
  | 'play'
  | 'chevron-right'
  | 'chevron-left'
  | 'star'
  | 'shield'
  | 'globe'
  | 'mail'
  | 'install'
  | 'leaderboard'
  | 'lesson'
  | 'practice'
  | 'profile'
  | 'kids'
  | 'help';

type IconColor =
  | 'ink'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'on-surface-1'
  | 'on-paper';

export type IconSvgProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
  'data-color'?: IconColor;
};

function Svg({ title, size, children, ...rest }: IconSvgProps & { children: React.ReactNode }) {
  const svgProps: React.SVGProps<SVGSVGElement> = {
    width: size ?? 24,
    height: size ?? 24,
    viewBox: '0 0 24 24',
    role: 'img',
    'aria-hidden': title ? undefined : true,
    focusable: false,
    ...rest,
  };

  return (
    <svg {...svgProps}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const Icons: Record<IconName, (props: IconSvgProps) => JSX.Element> = {
  tortoise: (props) => (
    <Svg {...props}>
      <path
        fill="currentColor"
        d="M4 13c0-3.5 3.2-6.5 8-6.5 3.9 0 7 2.2 7.7 5.1l1.3.4a1 1 0 0 1 .7 1.2l-.2 1a1 1 0 0 1-1 .8h-1.6a3 3 0 0 1-2.8 2H12a3 3 0 0 1-2.8-2H7.3a3.3 3.3 0 0 1-3.3-3Z"
      />
      <circle cx="11" cy="10.5" r="0.9" fill="currentColor" />
    </Svg>
  ),
  books: (props) => (
    <Svg {...props}>
      <path fill="currentColor" d="M5 4h6a2 2 0 0 1 2 2v12H7a2 2 0 0 1-2-2V4Zm8 0h6v12a2 2 0 0 1-2 2h-6V6a2 2 0 0 1 2-2Z" />
      <path fill="currentColor" d="M7 6h4v1H7zM15 6h4v1h-4z" />
    </Svg>
  ),
  party: (props) => (
    <Svg {...props}>
      <path fill="currentColor" d="M3 20l4.5-10L17 19 3 20Z" />
      <path fill="currentColor" d="M10 4c2 0 3 1 3 3" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </Svg>
  ),
  mic: (props) => (
    <Svg {...props}>
      <rect x="9" y="3" width="6" height="10" rx="3" fill="currentColor" />
      <path d="M6 10v1a6 6 0 0 0 12 0v-1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 17v3" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  ),
  badge: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="7" fill="currentColor" />
      <path
        d="M12 8l1.6 3.3 3.6.3-2.7 2.3.8 3.5-3.3-1.8-3.3 1.8.8-3.5L6.8 11.6l3.6-.3L12 8z"
        fill="var(--paper)"
      />
    </Svg>
  ),
  play: (props) => (
    <Svg {...props}>
      <path d="M8 6l9 6-9 6V6z" fill="currentColor" />
    </Svg>
  ),
  'chevron-right': (props) => (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
    </Svg>
  ),
  'chevron-left': (props) => (
    <Svg {...props}>
      <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
    </Svg>
  ),
  star: (props) => (
    <Svg {...props}>
      <path
        d="M12 3l2.7 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17l-5.5 2.9 1.1-6.1L3 9.5l6.2-.9L12 3z"
        fill="currentColor"
      />
    </Svg>
  ),
  shield: (props) => (
    <Svg {...props}>
      <path d="M12 3l7 3v5c0 4.4-3.2 8.4-7 9-3.8-.6-7-4.6-7-9V6l7-3z" fill="currentColor" />
    </Svg>
  ),
  globe: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 12h18M12 3a12 12 0 0 1 0 18M12 3a12 12 0 0 0 0 18" stroke="currentColor" strokeWidth="1" />
    </Svg>
  ),
  mail: (props) => (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" />
      <path d="M3 7l9 6 9-6" stroke="var(--paper)" strokeWidth="1.2" fill="none" />
    </Svg>
  ),
  install: (props) => (
    <Svg {...props}>
      <path d="M12 3v9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="5" y="13" width="14" height="8" rx="2" fill="currentColor" />
    </Svg>
  ),
  leaderboard: (props) => (
    <Svg {...props}>
      <rect x="3" y="12" width="4" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="7" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="17" y="10" width="4" height="9" rx="1" fill="currentColor" />
    </Svg>
  ),
  lesson: (props) => (
    <Svg {...props}>
      <path d="M6 4h10a2 2 0 0 1 2 2v12H8a2 2 0 0 1-2-2V4z" fill="currentColor" />
      <path d="M8 7h8M8 10h8" stroke="var(--paper)" />
    </Svg>
  ),
  practice: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 14l3-4 2 2 3-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  profile: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="9" r="3" fill="currentColor" />
      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  kids: (props) => (
    <Svg {...props}>
      <circle cx="9" cy="10" r="2.5" fill="currentColor" />
      <circle cx="15" cy="10" r="2.5" fill="currentColor" />
      <path d="M5 18a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </Svg>
  ),
  help: (props) => (
    <Svg {...props}>
      <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.1 9a3 3 0 1 1 5.8 1c0 1.4-1.5 1.9-2.1 2.6-.3.3-.4.7-.4 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </Svg>
  ),
};
