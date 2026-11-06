"use client";

import Link from "next/link";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import DashboardCard from "@/components/DashboardCard";
import DetailRow from "@/components/DetailRow";
import { PATHS } from "@/routes/paths";

import type { Profile } from "@/api/profile/types";

export interface ProfileSummaryProps {
  profile: Profile | null;
  loading: boolean;
}

export default function ProfileSummary({
  profile,
  loading,
}: ProfileSummaryProps) {
  const name = loading ? "Loading…" : (profile?.name ?? "Not set");

  return (
    <DashboardCard
      title="Public profile"
      subtitle={name}
      icon={<PersonOutlineIcon />}
      action={
        <Button component={Link} href={PATHS.dashboard.profile} size="small">
          Edit
        </Button>
      }
    >
      <DetailRow label="Age" value={loading ? "—" : (profile?.age ?? "—")} />
      <DetailRow
        label="Country"
        value={loading ? "—" : (profile?.country ?? "Not set")}
      />
      <DetailRow
        label="Bio"
        value={
          loading ? "—" : profile?.bio ? "Set" : "Not set"
        }
      />
      <Typography variant="caption" color="text.secondary">
        Age is calculated by the backend from the date of birth.
      </Typography>
    </DashboardCard>
  );
}
