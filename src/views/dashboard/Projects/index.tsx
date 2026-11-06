"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { deleteProject, getGroupedProjects } from "@/app/actions/projects-actions";
import {
  projectGroupQueryKeys,
  projectQueryKeys,
} from "@/api/react-query-keys";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import SectionHeading from "@/components/SectionHeading";
import ProjectDialog from "@/views/dashboard/Projects/components/ProjectDialog";
import ProjectGroupSection from "@/views/dashboard/Projects/components/ProjectGroupSection";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { PATHS } from "@/routes/paths";
import { extractErrorMessage } from "@/utils/display";

import type { Project } from "@/api/projects/types";

type EditTarget = { project: Project; groupId: number };

export default function ProjectsView() {
  const queryClient = useQueryClient();
  const [createGroupId, setCreateGroupId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const groupedQuery = useQuery({
    queryKey: projectQueryKeys.grouped,
    queryFn: () => getGroupedProjects(),
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({ mutationFn: deleteProject });
  useSessionExpiry(
    deleteMutation.data?.success === false &&
      deleteMutation.data.sessionExpired === true,
  );

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    await queryClient.invalidateQueries({
      queryKey: projectGroupQueryKeys.all,
    });
  };

  const openDelete = (project: Project) => {
    deleteMutation.reset();
    setDeleteTarget(project);
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
        setNotice("Project deleted.");
        void refresh();
      },
    });
  };

  const sections = groupedQuery.data ?? [];
  const groups = sections.map((section) => section.group);
  const deleteError =
    deleteMutation.data?.success === false ? deleteMutation.data.error : null;

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Projects"
        subtitle="Portfolio work, organised by group."
        action={
          <Button
            component={Link}
            href={PATHS.dashboard.projectGroups}
            variant="outlined"
          >
            Manage groups
          </Button>
        }
      />

      {notice !== null ? (
        <Alert severity="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      ) : null}

      {groupedQuery.isPending ? (
        <LoadingState label="Loading projects…" />
      ) : groupedQuery.isError ? (
        <EmptyState
          title="Unable to load projects"
          description={extractErrorMessage(groupedQuery.error)}
          action={
            <Button
              variant="contained"
              onClick={() => void groupedQuery.refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : groups.length === 0 ? (
        <EmptyState
          title="Create a project group first"
          description="Every project must belong to a group. Add a group, then come back to add projects."
          action={
            <Button
              component={Link}
              href={PATHS.dashboard.projectGroups}
              variant="contained"
              color="success"
            >
              Manage groups
            </Button>
          }
        />
      ) : (
        <Stack spacing={4}>
          {sections.map((section) => (
            <ProjectGroupSection
              key={section.group.id}
              group={section.group}
              projects={section.projects}
              onAdd={() => setCreateGroupId(section.group.id)}
              onEdit={(project) =>
                setEditTarget({ project, groupId: section.group.id })
              }
              onDelete={openDelete}
            />
          ))}
        </Stack>
      )}

      {createGroupId !== null ? (
        <ProjectDialog
          groups={groups}
          groupId={createGroupId}
          onClose={() => setCreateGroupId(null)}
          onSaved={() => {
            setCreateGroupId(null);
            setNotice("Project created.");
            void refresh();
          }}
        />
      ) : null}

      {editTarget !== null ? (
        <ProjectDialog
          groups={groups}
          groupId={editTarget.groupId}
          project={editTarget.project}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            setNotice("Project updated.");
            void refresh();
          }}
        />
      ) : null}

      {deleteTarget !== null ? (
        <ConfirmActionDialog
          title="Delete project?"
          description={`“${deleteTarget.title}” and its uploaded image will be permanently removed.`}
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
