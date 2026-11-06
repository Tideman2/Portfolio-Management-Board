"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import DashboardCard from "@/components/DashboardCard";

import type { ProjectGroup } from "@/api/project-groups/types";

export interface GroupsTableProps {
  groups: ProjectGroup[];
  /** Undefined while project counts are still loading. */
  counts: Partial<Record<number, number>>;
  onEdit: (group: ProjectGroup) => void;
  onDelete: (group: ProjectGroup) => void;
}

export default function GroupsTable({
  groups,
  counts,
  onEdit,
  onDelete,
}: GroupsTableProps) {
  return (
    <DashboardCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
      <TableContainer>
        <Table size="small" aria-label="Project groups">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => {
              const projectCount = counts[group.id];
              const blocked = projectCount !== 0;

              return (
                <TableRow key={group.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{group.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {group.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>{projectCount ?? "…"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Rename">
                      <IconButton
                        aria-label={`Rename ${group.name}`}
                        onClick={() => onEdit(group)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        projectCount === undefined
                          ? "Checking this group's projects…"
                          : blocked
                            ? "Move or delete this group's projects first"
                            : "Delete"
                      }
                    >
                      <span>
                        <IconButton
                          aria-label={`Delete ${group.name}`}
                          color="error"
                          disabled={blocked}
                          onClick={() => onDelete(group)}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
}
