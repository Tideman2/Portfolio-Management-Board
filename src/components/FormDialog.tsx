"use client";

import { useId } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import type { FormEvent, ReactNode } from "react";

export interface FormDialogProps {
  title: string;
  description?: string;
  submitLabel: string;
  pending: boolean;
  error: string | null;
  submitDisabled?: boolean;
  maxWidth?: "sm" | "md";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Shared dialog shell for create/edit forms. Mounted only while open so field
 * state resets naturally after a save or cancel.
 */
export default function FormDialog({
  title,
  description,
  submitLabel,
  pending,
  error,
  submitDisabled = false,
  maxWidth = "sm",
  onSubmit,
  onClose,
  children,
}: FormDialogProps) {
  const titleId = useId();

  return (
    <Dialog
      open
      fullWidth
      maxWidth={maxWidth}
      onClose={pending ? undefined : onClose}
      disableEscapeKeyDown={pending}
      aria-labelledby={titleId}
    >
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogTitle id={titleId}>{title}</DialogTitle>
        <DialogContent dividers>
          {description !== undefined ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          ) : null}

          {error !== null ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          {children}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={pending || submitDisabled}
          >
            {pending ? "Saving…" : submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
