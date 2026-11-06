"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { socialSchema } from "@/api/socials/schemas";
import { createSocial, updateSocial } from "@/app/actions/socials-actions";
import FormDialog from "@/components/FormDialog";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { toFieldErrors } from "@/utils/zod";

import type { Social } from "@/api/socials/types";
import type { FieldErrors } from "@/utils/zod";
import type { FormEvent } from "react";

export interface SocialDialogProps {
  /** Omit to create a new link. */
  social?: Social;
  onClose: () => void;
  onSaved: () => void;
}

export default function SocialDialog({
  social,
  onClose,
  onSaved,
}: SocialDialogProps) {
  const [values, setValues] = useState({
    platform_name: social?.platform_name ?? "",
    url: social?.url ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { platform_name: string; url: string }) =>
      social === undefined
        ? createSocial(payload)
        : updateSocial(social.id, payload),
  });
  useSessionExpiry(
    mutation.data?.success === false && mutation.data.sessionExpired === true,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = socialSchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    mutation.mutate(parsed.data, {
      onSuccess: (result) => {
        if (!result.success) {
          setFormError(result.error);
          setFieldErrors(result.fieldErrors ?? {});
          return;
        }

        onSaved();
      },
      onError: () => setFormError("Unable to save the social link."),
    });
  };

  return (
    <FormDialog
      title={social === undefined ? "Add social link" : "Edit social link"}
      description="Shown as a link in the public profile section."
      submitLabel={social === undefined ? "Add link" : "Save changes"}
      pending={mutation.isPending}
      error={formError}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Stack spacing={2}>
        <TextField
          label="Platform"
          autoFocus
          value={values.platform_name}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              platform_name: event.target.value,
            }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.platform_name !== undefined}
          helperText={fieldErrors.platform_name ?? "For example GitHub or LinkedIn."}
          fullWidth
        />
        <TextField
          label="Profile URL"
          type="url"
          value={values.url}
          onChange={(event) =>
            setValues((current) => ({ ...current, url: event.target.value }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.url !== undefined}
          helperText={fieldErrors.url ?? "Must include https://."}
          fullWidth
        />
      </Stack>
    </FormDialog>
  );
}
