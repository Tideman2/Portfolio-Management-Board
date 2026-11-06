"use client";

import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ProjectCard from "@/views/dashboard/Projects/components/ProjectCard";

import type { Project } from "@/api/projects/types";
import type { ProjectGroup } from "@/api/project-groups/types";

export interface ProjectGroupSectionProps {
  group: ProjectGroup;
  projects: Project[];
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectGroupSection({
  group,
  projects,
  onAdd,
  onEdit,
  onDelete,
}: ProjectGroupSectionProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {group.slug} · {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add project
        </Button>
      </Stack>

      {projects.length === 0 ? (
        <Box
          sx={{
            border: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            borderRadius: 2,
            px: 3,
            py: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No projects in this group yet.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => onEdit(project)}
              onDelete={() => onDelete(project)}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}
