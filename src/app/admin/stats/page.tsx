import AdminLayoutShell from "@/components/admin-shell";
import { updateStatsAction } from "@/lib/actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const statFields = [
  { key: "bagsCollected", label: "Bags collected", hint: 'e.g. "3.8k" or "4,120"' },
  { key: "beachesCovered", label: "Beaches covered", hint: 'e.g. "12"' },
  { key: "cleanupsRun", label: "Clean-ups run", hint: 'e.g. "40+"' },
  { key: "volunteers", label: "Volunteers strong", hint: 'e.g. "900"' },
];

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const notice = typeof params.updated === "string" ? "Impact stats updated and now live on the site." : null;

  const stats = await prisma.siteStat.findMany();
  const statsByKey = new Map(stats.map((stat) => [stat.key, stat.value]));

  return (
    <AdminLayoutShell title="Impact stats" description="The numbers shown in the stat tiles on the home and about pages.">
      {notice ? (
        <div className="success-panel admin-notice">
          <p>{notice}</p>
        </div>
      ) : null}

      <section className="admin-panel">
        <div className="panel-heading">
          <div>
            <p className="admin-kicker">Shown publicly</p>
            <h2>Edit impact stats</h2>
          </div>
        </div>
        <p className="form-message">
          Leave a field blank to hide that stat. Everything you save will appear immediately on the home and about pages.
        </p>
        <form action={updateStatsAction} className="auth-form">
          {statFields.map((field) => (
            <label key={field.key}>
              {field.label}
              <input
                type="text"
                name={field.key}
                defaultValue={statsByKey.get(field.key) ?? ""}
                placeholder="—"
                maxLength={40}
              />
              <small style={{ fontWeight: 400, fontSize: 12 }}>{field.hint}</small>
            </label>
          ))}
          <button type="submit" className="blue-button auth-button">
            Save stats <span>↗</span>
          </button>
        </form>
      </section>
    </AdminLayoutShell>
  );
}