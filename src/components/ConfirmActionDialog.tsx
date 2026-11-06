"use client";

import { useId } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import type { ReactNode } from "react";

export interface ConfirmActionDialogProps {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmColor?: "primary" | "error" | "success" | "warning";
  pending: boolean;
  error: string | null;
  /** Optional warning alert rendered above the error alert. */
  warning?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Mounted only while the parent wants it open, so the dialog resets naturally
 * after the action succeeds or is abandoned.
 */
export default function ConfirmActionDialog({
  title,
  description,
  confirmLabel,
  confirmColor = "primary",
  pending,
  error,
  warning,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) {
  const titleId = useId();

  const handleClose = () => {
    if (!pending) {
      onClose();
    }
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      disableEscapeKeyDown={pending}
      aria-labelledby={titleId}
    >
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
        {warning !== null && warning !== undefined && warning !== "" ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {warning}
          </Alert>
        ) : null}
        {error !== null ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={pending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={pending}
        >
          {pending ? "Working…" : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
