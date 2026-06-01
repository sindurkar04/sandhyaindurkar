"use client";

import dynamic from "next/dynamic";

const RegressionExplorer = dynamic(() => import("@/components/RegressionExplorer"), {
  ssr: false,
  loading: () => (
    <div className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center text-sm text-[color:var(--muted)]">
      Loading…
    </div>
  ),
});

export default function RegressionExplorerLoader() {
  return <RegressionExplorer />;
}
