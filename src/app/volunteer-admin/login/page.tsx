import AdminLogin from "@/components/admin-login";
import { volunteerAdminLoginAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function VolunteerAdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const error = typeof params.error === "string" ? params.error : undefined;

  return <AdminLogin portal="volunteer" action={volunteerAdminLoginAction} error={error} />;
}