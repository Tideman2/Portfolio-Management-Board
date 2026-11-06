"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getProfile } from "@/app/actions/profile-actions";
import { profileQueryKeys } from "@/api/react-query-keys";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import SectionHeading from "@/components/SectionHeading";
import ProfileForm from "@/views/dashboard/Profile/components/ProfileForm";
import { extractErrorMessage } from "@/utils/display";

import type { Profile } from "@/api/profile/types";

const EMPTY_PROFILE: Profile = {
  name: null,
  date_of_birth: null,
  age: null,
  country: null,
  bio: null,
};

export default function ProfileView() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: profileQueryKeys.detail,
    queryFn: () => getProfile(),
    staleTime: 60_000,
  });

  const handleSaved = (profile: Profile) => {
    queryClient.setQueryData(profileQueryKeys.detail, profile);
    setNotice("Profile saved.");
  };

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Profile"
        subtitle="The introduction shown on the public portfolio site."
      />

      {notice !== null ? (
        <Alert severity="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      ) : null}

      {profileQuery.isPending ? (
        <LoadingState label="Loading profile…" />
      ) : profileQuery.isError ? (
        <EmptyState
          title="Unable to load the profile"
          description={extractErrorMessage(
            profileQuery.error,
            "Check the backend connection and try again.",
          )}
          action={
            <Button variant="contained" onClick={() => void profileQuery.refetch()}>
              Retry
            </Button>
          }
        />
      ) : (
        <ProfileForm
          profile={profileQuery.data ?? EMPTY_PROFILE}
          onSaved={handleSaved}
        />
      )}
    </Stack>
  );
}
