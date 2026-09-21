import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { signUpAction } from "@/lib/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const next = typeof params.next === "string" ? params.next : "/verify?status=sent";
  const isAlreadyRegistered = params.error === "already-registered";

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="auth-scene">
        <div className="auth-art">
          <span className="pill pill-sun">Become a member</span>
          <h2>
            Turn a beach morning into a <em>shared story.</em>
          </h2>
          <p>
            Create an account to publish stories from the shoreline, comment on other people&apos;s
            posts, and stay close to the movement.
          </p>
          <div className="auth-pills">
            <span className="pill pill-aqua">Write</span>
            <span className="pill pill-teal">Comment</span>
            <span className="pill pill-pink">Connect</span>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-inner">
            <span className="pill pill-blue">Sign up</span>
            <h1>Create your account.</h1>
            {isAlreadyRegistered ? (
              <div className="notice notice-danger" role="alert">
                That email address is already registered. Try logging in instead.
              </div>
            ) : null}
            <form className="auth-form" action={signUpAction}>
              <input type="hidden" name="next" value={next} />
              <label>
                Full name
                <input type="text" name="name" placeholder="Your name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="Create a password" minLength={8} required />
              </label>
              <button type="submit" className="btn btn-primary btn-block">
                Sign up &amp; stay logged in →
              </button>
            </form>
            <p className="auth-switch">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
            <Link className="back-link" href="/">
              ← Back home
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
