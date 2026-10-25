"use client";

import { IconTrash } from "../icons";
import { Button } from "./Button";

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
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {isDanger && (
          <div className="empty-ic" style={{ margin: "0 0 16px", background: "var(--red-soft)", color: "var(--red)", width: 48, height: 48 }}>
            <IconTrash size={20} />
          </div>
        )}
        <div className="modal-h"><h3>{title}</h3></div>
        <p className="lead" style={{ marginBottom: 0 }}>{message}</p>
        <div className="modal-foot">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
          <Button variant={isDanger ? "danger" : "primary"} onClick={onConfirm} loading={isLoading} loadingText="Please wait…">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
