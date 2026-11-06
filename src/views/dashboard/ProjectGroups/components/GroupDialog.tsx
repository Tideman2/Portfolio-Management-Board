"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { projectGroupSchema } from "@/api/project-groups/schemas";
import {
  createProjectGroup,
  updateProjectGroup,
} from "@/app/actions/project-groups-actions";
import FormDialog from "@/components/FormDialog";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { toFieldErrors } from "@/utils/zod";

import type { ProjectGroup } from "@/api/project-groups/types";
import type { FieldErrors } from "@/utils/zod";
import type { FormEvent } from "react";

export interface GroupDialogProps {
  /** Omit to create a new group. */
  group?: ProjectGroup;
  onClose: () => void;
  onSaved: () => void;
}

export default function GroupDialog({
  group,
  onClose,
  onSaved,
}: GroupDialogProps) {
  const [name, setName] = useState(group?.name ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      group === undefined
        ? createProjectGroup(payload)
        : updateProjectGroup(group.id, payload),
  });
  useSessionExpiry(
    mutation.data?.success === false && mutation.data.sessionExpired === true,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = projectGroupSchema.safeParse({ name });

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
      onError: () => setFormError("Unable to save the group."),
    });
  };

  return (
    <FormDialog
      title={group === undefined ? "New project group" : "Rename group"}
      description={
        group === undefined
          ? "Groups organise projects on the public site. The slug is generated from the name."
          : "The slug stays the same after a rename, so existing links keep working."
      }
      submitLabel={group === undefined ? "Create group" : "Save name"}
      pending={mutation.isPending}
      error={formError}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Stack spacing={2}>
        <TextField
          label="Group name"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={mutation.isPending}
          error={fieldErrors.name !== undefined}
          helperText={fieldErrors.name ?? "Between 1 and 100 characters."}
          fullWidth
        />
        {group !== undefined ? (
          <Typography variant="caption" color="text.secondary">
            Slug: {group.slug} (read-only)
          </Typography>
        ) : null}
      </Stack>
    </FormDialog>
  );
}
