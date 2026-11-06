"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import DashboardCard from "@/components/DashboardCard";

import type { Social } from "@/api/socials/types";

export interface SocialsTableProps {
  socials: Social[];
  onEdit: (social: Social) => void;
  onDelete: (social: Social) => void;
}

export default function SocialsTable({
  socials,
  onEdit,
  onDelete,
}: SocialsTableProps) {
  return (
    <DashboardCard contentSx={{ p: 0, "&:last-child": { pb: 0 } }}>
      <TableContainer>
        <Table size="small" aria-label="Social links">
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>URL</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {socials.map((social) => (
              <TableRow key={social.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {social.platform_name}
                </TableCell>
                <TableCell sx={{ maxWidth: 260 }}>
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    noWrap
                    sx={{ display: "block" }}
                  >
                    {social.url}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label={`Edit ${social.platform_name}`}
                      onClick={() => onEdit(social)}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label={`Delete ${social.platform_name}`}
                      color="error"
                      onClick={() => onDelete(social)}
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
