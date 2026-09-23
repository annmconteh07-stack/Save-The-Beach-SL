import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { loginAction } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const next = typeof params.next === "string" ? params.next : "/blog";
  const isInvalid = params.error === "invalid-credentials";

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="auth-scene">
        <div className="auth-art" style={{ background: "var(--grad-sunset)" }}>
          <span className="pill pill-navy" style={{ background: "rgba(4,32,63,.8)", color: "#fff" }}>
            Member login
          </span>
          <h2 style={{ color: "#3a1600" }}>
            Welcome <em style={{ color: "#7a2f00" }}>back to the shore.</em>
          </h2>
          <p style={{ color: "#5b2a08" }}>
            Log in to publish stories, join the conversation, and keep up with every clean-up on
            the coast.
          </p>
          <div className="auth-pills">
            <span className="pill pill-sun">Your stories</span>
            <span className="pill pill-pink">Your events</span>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-inner">
            <span className="pill pill-blue">Log in</span>
            <h1>Welcome back.</h1>
            {isInvalid ? (
              <div className="notice notice-danger" role="alert">
                Invalid email or password. Please try again.
              </div>
            ) : null}
            <form className="auth-form" action={loginAction}>
              <input type="hidden" name="next" value={next} />
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="••••••••" minLength={8} required />
              </label>
              <button type="submit" className="btn btn-primary btn-block">
                Log in
              </button>
            </form>
            <p className="auth-switch">
              Need an account? <Link href="/signup">Create one</Link>
            </p>
            <Link className="back-link" href="/">
              Back home
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
