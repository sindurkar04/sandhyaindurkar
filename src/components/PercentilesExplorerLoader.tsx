"use client";

import dynamic from "next/dynamic";

const PercentilesExplorer = dynamic(() => import("@/components/PercentilesExplorer"), {
  ssr: false,
  loading: () => (
    <div className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center text-sm text-[color:var(--muted)]">
      Loading interactive chart…
    </div>
  ),
});

export default function PercentilesExplorerLoader() {
  return <PercentilesExplorer />;
}
