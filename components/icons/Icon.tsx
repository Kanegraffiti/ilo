import * as React from 'react';
import { Icons, type IconName, type IconSvgProps } from './icons';

type IconProps = {
  name: IconName;
  size?: number;
  title?: string;
  className?: string;
  color?: string;
  'data-color'?: IconSvgProps['data-color'];
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>;

export default function Icon({
  name,
  size = 24,
  title,
  className,
  color = 'currentColor',
  'data-color': dataColor,
  ...spanProps
}: IconProps) {
  const SvgIcon = Icons[name];
  return (
    <span className={className} style={{ color }} {...spanProps}>
      <SvgIcon size={size} title={title} data-color={dataColor} />
    </span>
  );
}
