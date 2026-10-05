// a question or heading that opens to show more. plain <details>, so it works
// without javascript
export default function Disclosure({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[1.35rem] leading-snug transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="relative size-3.5 shrink-0 text-primary">
          <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-current transition-transform duration-300 group-open:rotate-90" />
        </span>
      </summary>
      <div className="max-w-2xl pb-6 text-ink-soft [&>p+p]:mt-3">{children}</div>
    </details>
  );
}
