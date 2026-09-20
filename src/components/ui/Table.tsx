"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { IconArrowDown, IconArrowUp, IconChevronLeft, IconChevronRight, IconSort } from "@/components/icons";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right";
  hideOnMobile?: boolean;
  sort?: (row: T) => string | number | null;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
  pageSize?: number;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  itemLabel?: string;
  bare?: boolean;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

const compare = (a: string | number | null, b: string | number | null) => {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

function pageNumbers(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

export function Table<T>({ columns, rows, rowKey, rowHref, pageSize, defaultSort, itemLabel = "items", bare = false }: TableProps<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort ?? null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const column = sort ? columns.find((c) => c.key === sort.key) : undefined;
    if (!sort || !column?.sort) return rows;
    const getter = column.sort;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => dir * compare(getter(a), getter(b)));
  }, [rows, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, pageCount);
  useEffect(() => setPage(1), [rows.length]);

  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;
  const template = columns.map((c) => c.width ?? "1fr").join(" ");
  const cellClass = (c: Column<T>) => [c.align === "right" ? "ta-r" : "", c.hideOnMobile ? "hide-sm" : ""].filter(Boolean).join(" ");

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" }));

  const from = sorted.length === 0 ? 0 : (current - 1) * (pageSize ?? sorted.length) + 1;
  const to = Math.min(sorted.length, current * (pageSize ?? sorted.length));

  return (
    <div className={bare ? "tbl bare" : "pnl tbl"}>
      <div className="tr th" style={{ gridTemplateColumns: template }} role="row">
        {columns.map((c) => {
          const active = sort?.key === c.key;
          return (
            <span key={c.key} className={cellClass(c)} role="columnheader" aria-sort={active ? (sort?.dir === "asc" ? "ascending" : "descending") : undefined}>
              {c.sort ? (
                <button type="button" className={`th-btn ${active ? "on" : ""}`} onClick={() => toggleSort(c.key)}>
                  {c.header}
                  {active ? sort?.dir === "asc" ? <IconArrowUp size={12} /> : <IconArrowDown size={12} /> : <IconSort size={12} />}
                </button>
              ) : (
                c.header
              )}
            </span>
          );
        })}
      </div>

      {visible.map((row) => {
        const cells = columns.map((c) => (
          <div key={c.key} className={cellClass(c)} role="cell">{c.cell(row)}</div>
        ));
        const props = { className: "tr", style: { gridTemplateColumns: template } };
        return rowHref ? (
          <Link key={rowKey(row)} href={rowHref(row)} {...props}>{cells}</Link>
        ) : (
          <div key={rowKey(row)} {...props} role="row">{cells}</div>
        );
      })}

      {pageSize && sorted.length > 0 && (
        <div className="tbl-foot">
          <span>Showing <b>{from}–{to}</b> of <b>{sorted.length}</b> {itemLabel}</span>
          {pageCount > 1 && (
            <div className="pager">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page"><IconChevronLeft size={15} /></button>
              {pageNumbers(current, pageCount).map((p, i) =>
                p === "gap" ? <span key={`g${i}`} className="gap">…</span> : (
                  <button key={p} type="button" className={p === current ? "on" : ""} onClick={() => setPage(p)}>{p}</button>
                )
              )}
              <button type="button" disabled={current === pageCount} onClick={() => setPage(current + 1)} aria-label="Next page"><IconChevronRight size={15} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
