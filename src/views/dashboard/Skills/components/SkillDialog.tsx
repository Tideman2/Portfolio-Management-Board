"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { skillSchema } from "@/api/skills/schemas";
import { createSkill, updateSkill } from "@/app/actions/skills-actions";
import FormDialog from "@/components/FormDialog";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { toFieldErrors } from "@/utils/zod";

import type { Skill, SkillInput, SkillKind } from "@/api/skills/types";
import type { FieldErrors } from "@/utils/zod";
import type { FormEvent } from "react";

const KIND_NAME: Record<SkillKind, string> = {
  professional: "professional",
  technical: "technical",
};

const PROFICIENCY_OPTIONS = [1, 2, 3, 4, 5] as const;

export interface SkillDialogProps {
  kind: SkillKind;
  /** Omit to create a new skill. */
  skill?: Skill;
  onClose: () => void;
  onSaved: () => void;
}

export default function SkillDialog({
  kind,
  skill,
  onClose,
  onSaved,
}: SkillDialogProps) {
  const [values, setValues] = useState<SkillInput>({
    name: skill?.name ?? "",
    description: skill?.description ?? "",
    proficiency: skill?.proficiency ?? 3,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: SkillInput) =>
      skill === undefined
        ? createSkill(kind, payload)
        : updateSkill(kind, skill.id, payload),
  });
  useSessionExpiry(
    mutation.data?.success === false && mutation.data.sessionExpired === true,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = skillSchema.safeParse(values);

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
      onError: () => setFormError("Unable to save the skill."),
    });
  };

  return (
    <FormDialog
      title={`${skill === undefined ? "Add" : "Edit"} ${KIND_NAME[kind]} skill`}
      description="Proficiency is a whole number from 1 (learning) to 5 (expert)."
      submitLabel={skill === undefined ? "Add skill" : "Save changes"}
      pending={mutation.isPending}
      error={formError}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <Stack spacing={2}>
        <TextField
          label="Skill name"
          autoFocus
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({ ...current, name: event.target.value }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.name !== undefined}
          helperText={fieldErrors.name}
          fullWidth
        />
        <TextField
          label="Description"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.description !== undefined}
          helperText={fieldErrors.description}
          multiline
          minRows={3}
          fullWidth
        />
        <TextField
          select
          label="Proficiency"
          value={values.proficiency}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              proficiency: Number(event.target.value),
            }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.proficiency !== undefined}
          helperText={fieldErrors.proficiency}
          fullWidth
        >
          {PROFICIENCY_OPTIONS.map((level) => (
            <MenuItem key={level} value={level}>
              {level} / 5
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </FormDialog>
  );
}
