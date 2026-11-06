"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { profileUpdateSchema } from "@/api/profile/schemas";
import { saveProfile } from "@/app/actions/profile-actions";
import DashboardCard from "@/components/DashboardCard";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { toFieldErrors } from "@/utils/zod";

import type { Profile } from "@/api/profile/types";
import type { FieldErrors } from "@/utils/zod";
import type { ChangeEvent, FormEvent } from "react";

type ProfileValues = {
  name: string;
  date_of_birth: string;
  country: string;
  bio: string;
};

const toValues = (profile: Profile): ProfileValues => ({
  name: profile.name ?? "",
  date_of_birth: profile.date_of_birth ?? "",
  country: profile.country ?? "",
  bio: profile.bio ?? "",
});

export interface ProfileFormProps {
  profile: Profile;
  onSaved: (profile: Profile) => void;
}

export default function ProfileForm({ profile, onSaved }: ProfileFormProps) {
  const [values, setValues] = useState<ProfileValues>(() => toValues(profile));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({ mutationFn: saveProfile });
  useSessionExpiry(
    mutation.data?.success === false && mutation.data.sessionExpired === true,
  );

  const dirty = JSON.stringify(values) !== JSON.stringify(toValues(profile));

  const handleChange =
    (field: keyof ProfileValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const baseline = toValues(profile);
    const clearedField = (
      ["name", "date_of_birth", "country", "bio"] as const
    ).find(
      (field) => baseline[field] !== "" && values[field].trim() === "",
    );

    if (clearedField !== undefined) {
      setFieldErrors({
        [clearedField]:
          "This field cannot be cleared. Enter a new value instead.",
      });
      return;
    }

    const parsed = profileUpdateSchema.safeParse(values);

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

        setValues(toValues(result.data));
        onSaved(result.data);
      },
      onError: () => setFormError("Unable to save the profile."),
    });
  };

  return (
    <DashboardCard
      title="Profile details"
      subtitle="Fields cannot be cleared; send a new value to change one."
    >
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
        {formError !== null ? <Alert severity="error">{formError}</Alert> : null}

        <TextField
          label="Name"
          value={values.name}
          onChange={handleChange("name")}
          disabled={mutation.isPending}
          error={fieldErrors.name !== undefined}
          helperText={fieldErrors.name}
          fullWidth
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Date of birth"
            type="date"
            value={values.date_of_birth}
            onChange={handleChange("date_of_birth")}
            disabled={mutation.isPending}
            error={fieldErrors.date_of_birth !== undefined}
            helperText={
              fieldErrors.date_of_birth ??
              `Age is calculated by the backend: ${profile.age ?? "—"}`
            }
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            label="Country"
            value={values.country}
            onChange={handleChange("country")}
            disabled={mutation.isPending}
            error={fieldErrors.country !== undefined}
            helperText={fieldErrors.country}
            fullWidth
          />
        </Stack>

        <TextField
          label="Bio"
          value={values.bio}
          onChange={handleChange("bio")}
          disabled={mutation.isPending}
          error={fieldErrors.bio !== undefined}
          helperText={fieldErrors.bio}
          multiline
          minRows={5}
          fullWidth
        />

        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
          <Button
            variant="text"
            disabled={!dirty || mutation.isPending}
            onClick={() => {
              setValues(toValues(profile));
              setFieldErrors({});
              setFormError(null);
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={!dirty || mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Date of birth uses YYYY-MM-DD and must be a real calendar date.
        </Typography>
      </Stack>
    </DashboardCard>
  );
}
