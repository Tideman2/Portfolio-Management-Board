"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { login } from "@/app/actions/auth-actions";
import { loginSchema } from "@/api/auth/schemas";
import PasswordField from "@/components/PasswordField";
import { PATHS } from "@/routes/paths";
import { toFieldErrors } from "@/utils/zod";

import type { FieldErrors } from "@/utils/zod";
import type { FormEvent } from "react";

export type LoginViewProps = {
  notice?: string;
};

export default function LoginView({ notice }: LoginViewProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ username, password });

    if (!parsed.success) {
      setFieldErrors(toFieldErrors(parsed.error));
      return;
    }

    setPending(true);

    try {
      const result = await login(parsed.data);

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      router.replace(PATHS.dashboard.root);
      router.refresh();
    } catch {
      setFormError("Unable to sign in.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Use the administrator account to manage portfolio content.
        </Typography>
      </Box>

      {notice === "reauth" ? (
        <Alert severity="info">
          Your session ended. Sign in again to continue.
        </Alert>
      ) : null}

      {formError !== null ? <Alert severity="error">{formError}</Alert> : null}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            fullWidth
            value={username}
            disabled={pending}
            error={fieldErrors.username !== undefined}
            helperText={fieldErrors.username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            fullWidth
            value={password}
            disabled={pending}
            error={fieldErrors.password !== undefined}
            helperText={fieldErrors.password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            size="large"
            fullWidth
            disabled={pending}
          >
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
