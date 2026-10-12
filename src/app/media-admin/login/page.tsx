import { redirect } from "next/navigation";

import AdminLogin from "@/components/admin-login";
import { mediaAdminLoginAction } from "@/lib/actions";
import { getCurrentUser, isMediaAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MediaAdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const error = typeof params.error === "string" ? params.error : undefined;

  const current = await getCurrentUser();
  if (current && isMediaAdmin(current)) {
    redirect("/media-admin");
  }

  return <AdminLogin portal="media" action={mediaAdminLoginAction} error={error} />;
}