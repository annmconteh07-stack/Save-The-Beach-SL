import AdminLogin from "@/components/admin-login";
import { mediaAdminLoginAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function MediaAdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const error = typeof params.error === "string" ? params.error : undefined;

  return <AdminLogin portal="media" action={mediaAdminLoginAction} error={error} />;
}