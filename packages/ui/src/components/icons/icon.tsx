import type { ComponentProps } from 'react';

export type IconProps = ComponentProps<'svg'>;

export function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
      {...props}
    >
      {children}
    </svg>
  );
}
