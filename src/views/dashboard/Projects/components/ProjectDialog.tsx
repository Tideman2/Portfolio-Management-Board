"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { projectSchema } from "@/api/projects/schemas";
import {
  createProject,
  updateProject,
} from "@/app/actions/projects-actions";
import FormDialog from "@/components/FormDialog";
import ImageField from "@/components/ImageField";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { toFieldErrors } from "@/utils/zod";

import type { Project } from "@/api/projects/types";
import type { ProjectGroup } from "@/api/project-groups/types";
import type { FieldErrors } from "@/utils/zod";
import type { FormEvent } from "react";

type ProjectValues = {
  title: string;
  stack: string;
  goal: string;
  github_url: string;
  demo_url: string;
  group_id: number;
};

export interface ProjectDialogProps {
  groups: ProjectGroup[];
  /** Group preselected when adding from a group section. */
  groupId: number;
  /** Omit to create a new project. */
  project?: Project;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectDialog({
  groups,
  groupId,
  project,
  onClose,
  onSaved,
}: ProjectDialogProps) {
  const [values, setValues] = useState<ProjectValues>({
    title: project?.title ?? "",
    stack: project?.stack ?? "",
    goal: project?.goal ?? "",
    github_url: project?.github_url ?? "",
    demo_url: project?.demo_url ?? "",
    group_id: groupId,
  });
  const [image, setImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: ProjectValues & { image?: File }) =>
      project === undefined
        ? createProject(input)
        : updateProject(project.id, input),
  });
  useSessionExpiry(
    mutation.data?.success === false && mutation.data.sessionExpired === true,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = projectSchema.safeParse({
      ...values,
      image: image ?? undefined,
    });

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
      onError: () => setFormError("Unable to save the project."),
    });
  };

  return (
    <FormDialog
      title={project === undefined ? "New project" : "Edit project"}
      description="Projects appear on the public site under their group."
      submitLabel={project === undefined ? "Create project" : "Save changes"}
      pending={mutation.isPending}
      error={formError}
      onSubmit={handleSubmit}
      onClose={onClose}
      maxWidth="md"
    >
      <Stack spacing={2}>
        <TextField
          label="Title"
          autoFocus
          value={values.title}
          onChange={(event) =>
            setValues((current) => ({ ...current, title: event.target.value }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.title !== undefined}
          helperText={fieldErrors.title}
          fullWidth
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Stack"
            value={values.stack}
            onChange={(event) =>
              setValues((current) => ({ ...current, stack: event.target.value }))
            }
            disabled={mutation.isPending}
            error={fieldErrors.stack !== undefined}
            helperText={fieldErrors.stack ?? "For example Python, Flask, MySQL."}
            fullWidth
          />
          <TextField
            select
            label="Group"
            value={values.group_id}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                group_id: Number(event.target.value),
              }))
            }
            disabled={mutation.isPending}
            error={fieldErrors.group_id !== undefined}
            helperText={fieldErrors.group_id}
            fullWidth
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <TextField
          label="Goal"
          value={values.goal}
          onChange={(event) =>
            setValues((current) => ({ ...current, goal: event.target.value }))
          }
          disabled={mutation.isPending}
          error={fieldErrors.goal !== undefined}
          helperText={fieldErrors.goal}
          multiline
          minRows={3}
          fullWidth
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="GitHub URL"
            type="url"
            value={values.github_url}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                github_url: event.target.value,
              }))
            }
            disabled={mutation.isPending}
            error={fieldErrors.github_url !== undefined}
            helperText={fieldErrors.github_url}
            fullWidth
          />
          <TextField
            label="Demo URL"
            type="url"
            value={values.demo_url}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                demo_url: event.target.value,
              }))
            }
            disabled={mutation.isPending}
            error={fieldErrors.demo_url !== undefined}
            helperText={fieldErrors.demo_url}
            fullWidth
          />
        </Stack>
        <ImageField
          currentUrl={project?.image ?? null}
          file={image}
          onChange={setImage}
          disabled={mutation.isPending}
          error={fieldErrors.image}
        />
      </Stack>
    </FormDialog>
  );
}
