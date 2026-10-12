import { redirect } from "next/navigation";

import AdminLogin from "@/components/admin-login";
import { volunteerAdminLoginAction } from "@/lib/actions";
import { getCurrentUser, isVolunteerAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function VolunteerAdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const error = typeof params.error === "string" ? params.error : undefined;

  const current = await getCurrentUser();
  if (current && isVolunteerAdmin(current)) {
    redirect("/volunteer-admin");
  }

  return <AdminLogin portal="volunteer" action={volunteerAdminLoginAction} error={error} />;
}