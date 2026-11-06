import { redirect } from "next/navigation";

import { PATHS } from "@/routes/paths";

export default function Home(): never {
  redirect(PATHS.dashboard.root);
}
