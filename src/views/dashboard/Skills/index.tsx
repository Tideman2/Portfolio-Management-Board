"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

import { deleteSkill, getSkills } from "@/app/actions/skills-actions";
import { skillQueryKeys } from "@/api/react-query-keys";
import ConfirmActionDialog from "@/components/ConfirmActionDialog";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import SectionHeading from "@/components/SectionHeading";
import SkillDialog from "@/views/dashboard/Skills/components/SkillDialog";
import SkillTable from "@/views/dashboard/Skills/components/SkillTable";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { extractErrorMessage } from "@/utils/display";

import type { Skill, SkillKind } from "@/api/skills/types";

type DialogState = { skill?: Skill } | null;

const TABS: readonly { kind: SkillKind; label: string }[] = [
  { kind: "professional", label: "Professional" },
  { kind: "technical", label: "Technical" },
];

export default function SkillsView() {
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<SkillKind>("professional");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const professionalQuery = useQuery({
    queryKey: skillQueryKeys.list("professional"),
    queryFn: () => getSkills("professional"),
    staleTime: 60_000,
  });
  const technicalQuery = useQuery({
    queryKey: skillQueryKeys.list("technical"),
    queryFn: () => getSkills("technical"),
    staleTime: 60_000,
  });

  const activeQuery = kind === "professional" ? professionalQuery : technicalQuery;
  const counts: Record<SkillKind, number> = {
    professional: professionalQuery.data?.length ?? 0,
    technical: technicalQuery.data?.length ?? 0,
  };

  const deleteMutation = useMutation({
    mutationFn: (target: { kind: SkillKind; id: number }) =>
      deleteSkill(target.kind, target.id),
  });
  useSessionExpiry(
    deleteMutation.data?.success === false &&
      deleteMutation.data.sessionExpired === true,
  );

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: skillQueryKeys.all });

  const openDelete = (skill: Skill) => {
    deleteMutation.reset();
    setDeleteTarget(skill);
  };

  const confirmDelete = () => {
    if (deleteTarget === null) {
      return;
    }

    deleteMutation.mutate(
      { kind, id: deleteTarget.id },
      {
        onSuccess: (result) => {
          if (!result.success) {
            return;
          }

          setDeleteTarget(null);
          setNotice("Skill deleted.");
          void refresh();
        },
      },
    );
  };

  const skills = activeQuery.data ?? [];
  const kindLabel = kind === "professional" ? "professional" : "technical";
  const deleteError =
    deleteMutation.data?.success === false ? deleteMutation.data.error : null;

  return (
    <Stack spacing={3}>
      <SectionHeading
        title="Skills"
        subtitle="Professional and technical skills shown on the portfolio."
        action={
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setDialog({})}
          >
            Add skill
          </Button>
        }
      />

      {notice !== null ? (
        <Alert severity="success" onClose={() => setNotice(null)}>
          {notice}
        </Alert>
      ) : null}

      <Tabs
        value={kind}
        onChange={(_, next) => setKind(next as SkillKind)}
        aria-label="Skill categories"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.kind}
            value={tab.kind}
            label={`${tab.label} (${counts[tab.kind]})`}
          />
        ))}
      </Tabs>

      {activeQuery.isPending ? (
        <LoadingState label={`Loading ${kindLabel} skills…`} />
      ) : activeQuery.isError ? (
        <EmptyState
          title="Unable to load skills"
          description={extractErrorMessage(activeQuery.error)}
          action={
            <Button
              variant="contained"
              onClick={() => void activeQuery.refetch()}
            >
              Retry
            </Button>
          }
        />
      ) : skills.length === 0 ? (
        <EmptyState
          title={`No ${kindLabel} skills yet`}
          description="Add the first skill and set its proficiency from 1 to 5."
          action={
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={() => setDialog({})}
            >
              Add skill
            </Button>
          }
        />
      ) : (
        <>
          <SkillTable
            skills={skills}
            onEdit={(skill) => setDialog({ skill })}
            onDelete={openDelete}
          />
          <Typography variant="caption" color="text.secondary">
            {skills.length} {skills.length === 1 ? "skill" : "skills"} · ordered
            by ID
          </Typography>
        </>
      )}

      {dialog !== null ? (
        <SkillDialog
          kind={kind}
          skill={dialog.skill}
          onClose={() => setDialog(null)}
          onSaved={() => {
            setDialog(null);
            setNotice(dialog.skill ? "Skill updated." : "Skill added.");
            void refresh();
          }}
        />
      ) : null}

      {deleteTarget !== null ? (
        <ConfirmActionDialog
          title="Delete skill?"
          description={`“${deleteTarget.name}” will be removed from the ${kindLabel} skills. This cannot be undone.`}
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
