"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  deleteProjectGroup,
  getProjectGroups,
} from "@/app/actions/project-groups-actions";
import { getGroupedProjects } from "@/app/actions/projects-actions";
import {
  projectGroupQueryKeys,
  projectQueryKeys,
} from "@/api/react-query-keys";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import SectionHeading from "@/components/SectionHeading";
import GroupDialog from "@/views/dashboard/ProjectGroups/components/GroupDialog";
import GroupsTable from "@/views/dashboard/ProjectGroups/components/GroupsTable";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { extractErrorMessage } from "@/utils/display";

import type { ProjectGroup } from "@/api/project-groups/types";

type DialogState = { group?: ProjectGroup } | null;

export default function ProjectGroupsView() {
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectGroup | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const groupsQuery = useQuery({
    queryKey: projectGroupQueryKeys.list,
    queryFn: () => getProjectGroups(),
    staleTime: 60_000,
  });
  const groupedQuery = useQuery({
    queryKey: projectQueryKeys.grouped,
    queryFn: () => getGroupedProjects(),
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({ mutationFn: deleteProjectGroup });
  useSessionExpiry(
    deleteMutation.data?.success === false &&
      deleteMutation.data.sessionExpired === true,
  );

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: projectGroupQueryKeys.all,
    });
    await queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
  };

  const openDelete = (group: ProjectGroup) => {
    deleteMutation.reset();
    setDeleteTarget(group);
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
        setNotice("Project group deleted.");
        void refresh();
      },
    });
  };

  const counts: Record<number, number> = {};
  for (const entry of groupedQuery.data ?? []) {
    counts[entry.group.id] = entry.projects.length;
  }

  const groups = groupsQuery.data ?? [];
  const deleteError =
    deleteMutation.data?.success === false ? deleteMutation.data.error : null;

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Project groups"
        subtitle="Categories used to organise projects on the public site."
        action={
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setDialog({})}
          >
            New group
          </Button>
        }
      />

      {notice !== null ? (
        <Alert severity="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      ) : null}

      {groupsQuery.isPending ? (
        <LoadingState label="Loading project groups…" />
      ) : groupsQuery.isError ? (
        <EmptyState
          title="Unable to load project groups"
          description={extractErrorMessage(groupsQuery.error)}
          action={
            <Button
              variant="contained"
              onClick={() => void groupsQuery.refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : groups.length === 0 ? (
        <EmptyState
          title="No project groups yet"
          description="Create a group before adding projects; every project must belong to one."
          action={
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => setDialog({})}
            >
              New group
            </Button>
          }
        />
      ) : (
        <>
          <GroupsTable
            groups={groups}
            counts={counts}
            onEdit={(group) => setDialog({ group })}
            onDelete={openDelete}
          />
          <Typography variant="caption" color="text.secondary">
            A group with projects cannot be deleted; move or delete its projects
            first.
          </Typography>
        </>
      )}

      {dialog !== null ? (
        <GroupDialog
          group={dialog.group}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            setNotice(dialog.group ? "Group renamed." : "Group created.");
            void refresh();
          }}
        />
      ) : null}

      {deleteTarget !== null ? (
        <ConfirmActionDialog
          title="Delete project group?"
          description={`“${deleteTarget.name}” will be removed. This cannot be undone.`}
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
