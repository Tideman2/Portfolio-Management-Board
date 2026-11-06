import type { Metadata } from "next";

import LoginView from "@/views/Auth/Login";

export const metadata: Metadata = {
  title: "Sign in | Portfolio Admin",
};

type LoginPageProps = {
  searchParams: Promise<{ notice?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { notice } = await searchParams;
  const resolvedNotice = Array.isArray(notice) ? notice[0] : notice;

  return <LoginView notice={resolvedNotice} />;
}
