// a hairline with a small lozenge in the middle, the divider from the labels
export function Rule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 10"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 5h47M73 5h47" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="51.5" cy="5" r="1" />
      <path d="M60 1.2 63.8 5 60 8.8 56.2 5Z" />
      <circle cx="68.5" cy="5" r="1" />
    </svg>
  );
}

// a little line drawing of a lavender sprig
export function Sprig({ className = "" }: { className?: string }) {
  const buds = [44, 37, 30, 23, 16, 10];

  return (
    <svg
      viewBox="0 0 60 140"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M30 138C30 112 31.5 80 30 48" strokeWidth="1.1" />
      <path d="M30 48V6" strokeWidth="0.8" />
      <path d="M30 108C21 102 14 93 11 82C19 89 25 97 30 103" strokeWidth="1" />
      <path d="M30.5 94C39 89 45.5 80 48.5 70C41 77 35.5 85 30.5 90" strokeWidth="1" />
      <g fill="currentColor" stroke="none">
        {buds.map((y, i) => {
          const size = 1 - i * 0.07;
          return (
            <g key={y}>
              <ellipse
                cx={27.2}
                cy={y}
                rx={2.5 * size}
                ry={4 * size}
                transform={`rotate(-28 27.2 ${y})`}
              />
              <ellipse
                cx={32.8}
                cy={y - 3}
                rx={2.5 * size}
                ry={4 * size}
                transform={`rotate(28 32.8 ${y - 3})`}
              />
            </g>
          );
        })}
        <ellipse cx={30} cy={3.6} rx={1.8} ry={3} />
      </g>
    </svg>
  );
}
