"use client";

import { useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface ImageFieldProps {
  /** Existing image URL when editing. */
  currentUrl?: string | null;
  /** Newly selected file, if any. */
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Image picker with a live preview. Replaces the old image on upload; the
 * contract has no way to remove an image without adding a new one.
 */
export default function ImageField({
  currentUrl,
  file,
  onChange,
  disabled = false,
  error,
}: ImageFieldProps) {
  const previewUrl = useMemo(
    () => (file === null ? null : URL.createObjectURL(file)),
    [file],
  );

  useEffect(() => {
    if (previewUrl === null) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shownUrl = previewUrl ?? currentUrl ?? null;

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary">
        Project image (optional{currentUrl ? ", replaces the current image" : ""})
      </Typography>

      {shownUrl !== null ? (
        <Box
          component="img"
          src={shownUrl}
          alt="Project image preview"
          sx={{
            width: "100%",
            maxHeight: 180,
            objectFit: "cover",
            borderRadius: 1.5,
            border: 1,
            borderColor: "divider",
          }}
        />
      ) : null}

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          component="label"
          variant="outlined"
          size="small"
          disabled={disabled}
        >
          {file === null ? "Choose image" : "Replace image"}
          <input
            hidden
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              onChange(selected);
              event.target.value = "";
            }}
          />
        </Button>

        {file !== null ? (
          <Button
            size="small"
            color="inherit"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            Clear selection
          </Button>
        ) : null}
      </Stack>

      <FormHelperText error={error !== undefined}>
        {error ??
          (file === null
            ? "PNG, JPG or WebP up to 5 MB."
            : `${file.name} · ${Math.ceil(file.size / 1024)} KB`)}
      </FormHelperText>
    </Stack>
  );
}
