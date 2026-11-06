"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { Project } from "@/api/projects/types";

export interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        backgroundImage: "none",
      }}
    >
      {project.image !== null ? (
        <Box
          component="img"
          src={project.image}
          alt=""
          sx={{
            width: "100%",
            height: 140,
            objectFit: "cover",
            borderBottom: 1,
            borderColor: "divider",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <ImageOutlinedIcon fontSize="large" />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
          {project.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {project.stack ?? "No stack listed"}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.goal ?? "No goal described."}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {project.github_url !== null ? (
            <Button
              size="small"
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          ) : null}
          {project.demo_url !== null ? (
            <Button
              size="small"
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </Button>
          ) : null}
        </Stack>
        <Tooltip title="Edit">
          <IconButton aria-label={`Edit ${project.title}`} onClick={onEdit}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            aria-label={`Delete ${project.title}`}
            color="error"
            onClick={onDelete}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
