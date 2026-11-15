// small line icons for the benefit strip and the notes under the buy button.
// drawn on a 24 grid, in the current text colour

type IconProps = { className?: string };

function Icon({ className = "size-6", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Hourglass(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3h11M6.5 21h11" />
      <path d="M7.5 3c0 4.5 4.5 5.5 4.5 9s-4.5 4.5-4.5 9M16.5 3c0 4.5-4.5 5.5-4.5 9s4.5 4.5 4.5 9" />
      <path d="M9.5 18.5c1-1 4-1 5 0" />
    </Icon>
  );
}

export function Leaf(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 19c0-8.5 5.5-14 14-14 0 8.5-5.5 14-14 14Z" />
      <path d="M5 19 13.5 10.5" />
    </Icon>
  );
}

export function List(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10" />
      <path d="M5 5.2 6.3 6.5 5 7.8 3.7 6.5ZM5 10.7 6.3 12 5 13.3 3.7 12ZM5 16.2l1.3 1.3L5 18.8l-1.3-1.3Z" />
    </Icon>
  );
}

export function Tag(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3-8.7 8.7Z" />
      <circle cx="8" cy="8" r="1.4" />
    </Icon>
  );
}

export function Parcel(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z" />
      <path d="M3.5 7.5 12 11.5l8.5-4M12 11.5v9M7.8 5.5l8.4 4" />
    </Icon>
  );
}

export function Return(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 7.5 5 11.5l4 4" />
      <path d="M5 11.5h9.5a4.5 4.5 0 0 1 0 9H12" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function Chevron({ className, left = false }: IconProps & { left?: boolean }) {
  return (
    <Icon className={className}>
      <path d={left ? "M14.5 6 8.5 12l6 6" : "M9.5 6l6 6-6 6"} />
    </Icon>
  );
}
