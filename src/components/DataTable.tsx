type Column<T> = {
  key: keyof T;
  header: string;
  align?: "left" | "right";
};

type DataTableProps<T extends Record<string, string | number>> = {
  caption?: string;
  columns: Column<T>[];
  rows: T[];
};

export default function DataTable<T extends Record<string, string | number>>({
  caption,
  columns,
  rows,
}: DataTableProps<T>) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-[color:var(--border)]">
      <table className="w-full min-w-[320px] border-collapse text-left text-sm">
        {caption && (
          <caption className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-strong)]">
            {columns.map((column) => (
              <th
                className={`px-4 py-3 font-bold text-[color:var(--foreground)] ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
                key={String(column.key)}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              className="border-b border-[color:var(--border)] last:border-0 odd:bg-[color:var(--surface)] even:bg-[color:var(--surface-strong)]"
              key={`${String(row[columns[0].key])}-${index}`}
            >
              {columns.map((column) => (
                <td
                  className={`px-4 py-3 text-[color:var(--muted)] ${
                    column.align === "right" ? "text-right tabular-nums" : "text-left"
                  }`}
                  key={String(column.key)}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
