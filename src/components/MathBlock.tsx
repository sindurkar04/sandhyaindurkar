import type { ReactNode } from "react";

type MathBlockProps = {
  label?: string;
  formula: ReactNode;
  children?: ReactNode;
};

export default function MathBlock({ label, formula, children }: MathBlockProps) {
  return (
    <div className="my-6 space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-4">
      {label && (
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          {label}
        </p>
      )}
      <div className="text-[17px] font-bold leading-relaxed tracking-tight text-[color:var(--foreground)] sm:text-lg">
        {formula}
      </div>
      {children && (
        <div className="space-y-2 border-t border-[color:var(--border)] pt-3 text-sm leading-relaxed text-[color:var(--muted)]">
          {children}
        </div>
      )}
    </div>
  );
}
