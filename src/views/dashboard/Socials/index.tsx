"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { deleteSocial, getSocials } from "@/app/actions/socials-actions";
import { socialQueryKeys } from "@/api/react-query-keys";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import SectionHeading from "@/components/SectionHeading";
import SocialDialog from "@/views/dashboard/Socials/components/SocialDialog";
import SocialsTable from "@/views/dashboard/Socials/components/SocialsTable";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { extractErrorMessage } from "@/utils/display";

import type { Social } from "@/api/socials/types";

type DialogState = { social?: Social } | null;

export default function SocialsView() {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Social | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const socialsQuery = useQuery({
    queryKey: socialQueryKeys.list,
    queryFn: () => getSocials(),
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({ mutationFn: deleteSocial });
  useSessionExpiry(
    deleteMutation.data?.success === false &&
      deleteMutation.data.sessionExpired === true,
  );

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: socialQueryKeys.all });

  const openDelete = (social: Social) => {
    deleteMutation.reset();
    setDeleteTarget(social);
  };

  const confirmDelete = () => {
    if (deleteTarget === null) {
      return;
    }

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: (result) => {
        if (!result.success) {
          return;
        }

        setDeleteTarget(null);
        setNotice("Social link deleted.");
        void refresh();
      },
    });
  };

  const socials = socialsQuery.data ?? [];
  const deleteError =
    deleteMutation.data?.success === false ? deleteMutation.data.error : null;

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Social links"
        subtitle="Platforms linked from the public portfolio."
        action={
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setDialog({})}
          >
            Add link
          </Button>
        }
      />

      {notice !== null ? (
        <Alert severity="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      ) : null}

      {socialsQuery.isPending ? (
        <LoadingState label="Loading social links…" />
      ) : socialsQuery.isError ? (
        <EmptyState
          title="Unable to load social links"
          description={extractErrorMessage(socialsQuery.error)}
          action={
            <Button
              variant="contained"
              onClick={() => void socialsQuery.refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : socials.length === 0 ? (
        <EmptyState
          title="No social links yet"
          description="Add GitHub, LinkedIn, or any other profile the portfolio should link to."
          action={
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => setDialog({})}
            >
              Add link
            </Button>
          }
        />
      ) : (
        <>
          <SocialsTable
            socials={socials}
            onEdit={(social) => setDialog({ social })}
            onDelete={openDelete}
          />
          <Typography variant="caption" color="text.secondary">
            {socials.length} {socials.length === 1 ? "link" : "links"} · ordered
            by ID
          </Typography>
        </>
      )}

      {dialog !== null ? (
        <SocialDialog
          social={dialog.social}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            setNotice(dialog.social ? "Social link updated." : "Social link added.");
            void refresh();
          }}
        />
      ) : null}

      {deleteTarget !== null ? (
        <ConfirmActionDialog
          title="Delete social link?"
          description={`${deleteTarget.platform_name} will be removed from the public profile. This cannot be undone.`}
          confirmLabel="Delete"
          confirmColor="error"
          pending={deleteMutation.isPending}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </Stack>
  );
}
