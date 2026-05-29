"use client";

import dynamic from "next/dynamic";

const SampleSizeExplorer = dynamic(() => import("@/components/SampleSizeExplorer"), {
  ssr: false,
  loading: () => (
    <div className="my-8 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center text-sm text-[color:var(--muted)]">
      Loading…
    </div>
  ),
});

export default function SampleSizeExplorerLoader() {
  return <SampleSizeExplorer />;
}
