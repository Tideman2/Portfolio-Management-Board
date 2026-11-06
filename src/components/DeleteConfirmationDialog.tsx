"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { isConfirmationMatch } from "@/utils/confirmation";

import type { ReactNode } from "react";

export interface DeleteConfirmationDialogProps {
  title: string;
  description: ReactNode;
  /** The exact value the operator must type, usually an email address. */
  expectedValue: string;
  confirmLabel: string;
  pending: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Mounted only while the parent wants it open, so the confirmation input
 * resets naturally after a successful or abandoned deletion.
 */
export default function DeleteConfirmationDialog({
  title,
  description,
  expectedValue,
  confirmLabel,
  pending,
  error,
  onConfirm,
  onClose,
}: DeleteConfirmationDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const matches = isConfirmationMatch(expectedValue, confirmation);

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
      aria-labelledby="delete-confirmation-title"
    >
      <DialogTitle id="delete-confirmation-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{description}</DialogContentText>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Type{" "}
          <Box
            component="code"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "text.primary",
              wordBreak: "break-all",
            }}
          >
            {expectedValue}
          </Box>{" "}
          to confirm.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          label="Confirmation"
          value={confirmation}
          onChange={(event) => {
            setConfirmation(event.target.value);
          }}
          disabled={pending}
          error={confirmation.length > 0 && !matches}
          helperText={
            confirmation.length > 0 && !matches
              ? "Type the value exactly as shown."
              : "This action cannot be undone."
          }
        />
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
          color="error"
          onClick={onConfirm}
          disabled={!matches || pending}
        >
          {pending ? "Deleting…" : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
