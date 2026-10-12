import Link from "next/link";

import PasswordInput from "@/components/password-input";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export default function AdminLogin({
  portal,
  action,
  error,
}: {
  portal: "volunteer" | "media";
  action: (formData: FormData) => Promise<void>;
  error?: string;
}) {
  const isVolunteer = portal === "volunteer";
  const errorMessage =
    error === "invalid-email"
      ? "Please enter a valid email address."
      : error === "forbidden"
        ? isVolunteer
          ? "This account is not a volunteer admin. Try the media admin login instead."
          : "This account is not a media admin. Try the volunteer admin login instead."
        : error === "invalid-credentials"
          ? "Invalid email or password. Please try again."
          : null;

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="auth-scene">
        <div className="auth-art" style={{ background: "var(--grad-sunset)" }}>
          <span className="pill pill-navy" style={{ background: "rgba(4,32,63,.8)", color: "#fff" }}>
            {isVolunteer ? "Volunteer admin" : "Media admin"} login
          </span>
          <h2 style={{ color: "#3a1600" }}>
            Welcome back to the <em style={{ color: "#7a2f00" }}>{isVolunteer ? "control room." : "gallery."}</em>
          </h2>
          <p style={{ color: "#5b2a08" }}>
            {isVolunteer
              ? "Manage events, volunteers, site stats, and blog moderation in one place."
              : "Post and manage photos and videos from clean-ups on the media page."}
          </p>
          <div className="auth-pills">
            {isVolunteer ? (
              <>
                <span className="pill pill-sun">Your events</span>
                <span className="pill pill-pink">Your volunteers</span>
              </>
            ) : (
              <>
                <span className="pill pill-sun">Photos</span>
                <span className="pill pill-pink">Videos</span>
              </>
            )}
          </div>
        </div>
        <div className="auth-form-side">
          <div className="auth-inner">
            <span className="pill pill-blue">Log in</span>
            <h1>{isVolunteer ? "Volunteer admin." : "Media admin."}</h1>
            {errorMessage ? (
              <div className="notice notice-danger" role="alert">
                {errorMessage}
              </div>
            ) : null}
            <form className="auth-form" action={action}>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <PasswordInput name="password" label="Password" placeholder="••••••••" minLength={8} />
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