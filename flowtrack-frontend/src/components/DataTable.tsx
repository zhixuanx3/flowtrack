import type { ReactNode, Ref } from "react";

export interface Column<T> {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  // Plain columns: just read this field off the row.
  dataIndex?: keyof T;
  type?: "text" | "date";
  // Custom columns (avatars, badges, buttons, etc): provide this instead.
  render?: (row: T) => ReactNode;
}

const renderCell = <T,>(col: Column<T>, row: T): ReactNode => {
  if (col.render) return col.render(row);
  if (!col.dataIndex) return null;

  const value = row[col.dataIndex];
  if (value == null || value === "") return "—";

  return col.type === "date"
    ? new Date(value as string).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : String(value);
};

interface DataTableProps<T> {
  // Pass `false` for a column to conditionally omit it (e.g. permission-gated actions).
  columns: (Column<T> | false | null | undefined)[];
  data: T[];
  rowKey: (row: T) => string;
  toolbar?: ReactNode;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  emptyMessage?: string;
  containerRef?: Ref<HTMLDivElement>;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  toolbar,
  isLoading = false,
  isFetchingMore = false,
  emptyMessage = "No results found",
  containerRef,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((col): col is Column<T> =>
    Boolean(col),
  );

  return (
    <div className="border-line mt-4 flex min-h-0 flex-1 flex-col rounded-md border bg-white">
      {toolbar}

      <div
        ref={containerRef}
        className="scrollbar-white min-h-0 flex-1 overflow-auto"
      >
        <table className="w-full table-fixed text-sm">
          <thead className="border-line bg-surface-secondary sticky top-0 border-y">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`text-muted py-3 text-left font-medium ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !isLoading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-muted px-4 py-8 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-line hover:bg-surface-secondary border-b last:border-0"
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 ${col.cellClassName ?? ""}`}
                    >
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {(isLoading || isFetchingMore) && (
          <div className="text-muted py-4 text-center text-sm">Loading...</div>
        )}
      </div>
    </div>
  );
}
