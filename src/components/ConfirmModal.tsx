"use client";

import React from "react";
import { IconTrash } from "./icons";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  isOpen,
  title = "Delete Offer",
  message = "Are you sure you want to delete this offer? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 24,
          width: 420,
          maxWidth: "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          border: "1.5px solid var(--ink)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: isDanger ? "#FEE2E2" : "#EFF6FF",
              color: isDanger ? "#D92D20" : "#155EEF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <IconTrash size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{title}</h3>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px 0", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              color: "#475467",
              background: "#F1F5F9",
              border: "1.5px solid var(--ink)",
              borderRadius: 100,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFF",
              background: isDanger ? "#D92D20" : "#155EEF",
              border: "1.5px solid var(--ink)",
              borderRadius: 100,
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "2px 2px 0 var(--ink)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
