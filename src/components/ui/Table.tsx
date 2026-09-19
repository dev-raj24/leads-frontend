import Link from "next/link";
import type React from "react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Renders the cell for a row. */
  cell: (row: T) => React.ReactNode;
  /** CSS grid track, e.g. "1fr", "minmax(0, 1.5fr)", "110px". Defaults to "1fr". */
  width?: string;
  align?: "left" | "right";
  /** Hide this column on narrow screens (keeps the first column + last visible ones you don't hide). */
  hideOnMobile?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** When set, each row is a link. */
  rowHref?: (row: T) => string;
}

/** Generic table used by every list in the portal (leads, recent leads, …). Styles: `.tr` in portal.css. */
export function Table<T>({ columns, rows, rowKey, rowHref }: TableProps<T>) {
  const template = columns.map((c) => c.width ?? "1fr").join(" ");
  const cellClass = (c: Column<T>) => [c.align === "right" ? "ta-r" : "", c.hideOnMobile ? "hide-sm" : ""].filter(Boolean).join(" ");

  return (
    <div className="pnl">
      <div className="tr th" style={{ gridTemplateColumns: template }} role="row">
        {columns.map((c) => (
          <span key={c.key} className={cellClass(c)} role="columnheader">{c.header}</span>
        ))}
      </div>
      {rows.map((row) => {
        const inner = columns.map((c) => (
          <div key={c.key} className={cellClass(c)} role="cell">{c.cell(row)}</div>
        ));
        const props = { className: "tr", style: { gridTemplateColumns: template } };
        return rowHref ? (
          <Link key={rowKey(row)} href={rowHref(row)} {...props}>{inner}</Link>
        ) : (
          <div key={rowKey(row)} {...props} role="row">{inner}</div>
        );
      })}
    </div>
  );
}
