import Image from "next/image";
import type { Product, Tone } from "@/lib/products";
import { Rule } from "./ornament";

// labels sit a touch crooked, like a box set down by hand
const TILTS = [-1.3, 0.9, -0.5, 1.2, -1, 0.6, -1.1, 0.8];

interface ProductImageProps {
  product: Product;
  src?: string | null;
  sizes: string;
  preload?: boolean;
  className?: string;
}

// fills its parent, which sets the shape (usually aspect-photo). shows the
// photo when there is one and the bar's paper label when there isn't
export default function ProductImage({
  product,
  src = product.image,
  sizes,
  preload = false,
  className = "",
}: ProductImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${product.name} soap`}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <Label
      tone={product.tone}
      tilt={TILTS[(product.number - 1) % TILTS.length]}
      className={className}
      title={product.name}
      line={`No. ${String(product.number).padStart(2, "0")}`}
      label={`${product.name} soap`}
    />
  );
}

interface LabelProps {
  tone: Tone;
  tilt?: number;
  title: string;
  line: string;
  label: string;
  className?: string;
}

// a paper label laid on a colored ground. scales with its container, so the
// same drawing works as a thumbnail and as a hero
export function Label({
  tone,
  tilt = 0,
  title,
  line,
  label,
  className = "",
}: LabelProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`grain @container absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: tone.ground }}
    >
      {/* soft light falling across the ground */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 30% 15%, rgb(255 255 255 / 0.32), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="relative w-[54cqw] bg-surface p-[1.3cqw] shadow-[0_0.4cqw_0.6cqw_rgb(43_31_27/0.08),0_3cqw_5cqw_-2cqw_rgb(43_31_27/0.35)]"
        style={{ color: tone.ink, transform: `rotate(${tilt}deg)` }}
      >
        <div className="flex flex-col items-center border border-current/45 px-[3cqw] py-[3.6cqw] text-center">
          <span className="font-display text-[3.6cqw] leading-none">ochar</span>
          <Rule className="mt-[1.6cqw] w-[13cqw] opacity-70" />
          <span className="mt-[2.4cqw] font-display text-[5.6cqw] leading-[1.05] text-balance">
            {title}
          </span>
          <span className="mt-[2.6cqw] text-[1.75cqw] uppercase tracking-[0.2em] opacity-80">
            {line}
          </span>
        </div>
      </div>
    </div>
  );
}
