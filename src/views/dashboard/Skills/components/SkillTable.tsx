"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DashboardCard from "@/components/DashboardCard";

import type { Skill } from "@/api/skills/types";

export interface SkillTableProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export default function SkillTable({
  skills,
  onEdit,
  onDelete,
}: SkillTableProps) {
  return (
    <DashboardCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
      <TableContainer>
        <Table size="small" aria-label="Skills">
          <TableHead>
            <TableRow>
              <TableCell>Skill</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Proficiency</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id} hover>
                <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                  {skill.name}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 420,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {skill.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating
                      value={skill.proficiency}
                      max={5}
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {skill.proficiency}/5
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label={`Edit ${skill.name}`}
                      onClick={() => onEdit(skill)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label={`Delete ${skill.name}`}
                      color="error"
                      onClick={() => onDelete(skill)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
}
