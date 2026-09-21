import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import { resendVerificationAction, verifyEmailAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, { tone: string; title: string; body: string }> = {
  sent: {
    tone: "info",
    title: "Check your inbox",
    body: "We emailed a 6-digit code to your inbox. Enter it below to verify your account.",
  },
  verified: {
    tone: "success",
    title: "Email confirmed",
    body: "Your email is verified. You can now post stories and join the conversation.",
  },
  required: {
    tone: "warn",
    title: "Please confirm your email first",
    body: "To keep the community safe, you need a verified email before posting or commenting. Enter the code we sent you.",
  },
  invalid: {
    tone: "danger",
    title: "That code is not valid",
    body: "The code you entered is incorrect or has already been used. Check it and try again.",
  },
  expired: {
    tone: "warn",
    title: "That code has expired",
    body: "Confirmation codes last 48 hours. Request a new one below.",
  },
  already: {
    tone: "info",
    title: "Already verified",
    body: "This email address is already confirmed. Nothing else to do.",
  },
};

export default async function VerifyPage({ searchParams }: PageProps<"/verify">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const next = typeof params.next === "string" ? params.next : "/blog";
  const redirectAfterVerify = typeof params.next === "string" ? params.next : "";
  const user = await getCurrentUser();

  const message = status ? MESSAGES[status] : undefined;

  return (
    <section className="auth-scene verify-scene">
      <div className="verify-card">
        <span className="eyebrow">Account verification</span>

        {user && !user.emailVerified ? (
          <>
            <h1>{message?.title ?? "Enter your code"}</h1>
            <p className="verify-lead">
              We&apos;ve emailed a 6-digit code to <strong>{user.email}</strong>. Enter it
              below to confirm your account.
            </p>
            <form action={verifyEmailAction} className="verify-form">
              <input type="hidden" name="next" value={redirectAfterVerify} />
              <label className="verify-code-label">
                Confirmation code
                <input
                  type="text"
                  name="code"
                  className="verify-code-input"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  minLength={6}
                  maxLength={6}
                  placeholder="000000"
                  required
                />
              </label>
              <button type="submit" className="btn btn-primary btn-block">
                Verify email
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>{message?.title ?? "Verify your email"}</h1>
            <p className="verify-lead">{message?.body ?? "Sign up or log in to manage your verification."}</p>
          </>
        )}

        {message && status !== "sent" ? (
          <div className={`notice notice-${message.tone}`} role="status">
            {message.body}
          </div>
        ) : null}

        {user ? (
          <div className="verify-account">
            <p>
              Signed in as <strong>{user.email}</strong>
              {user.emailVerified ? " (verified)" : " (not yet verified)"}
            </p>
            {!user.emailVerified ? (
              <form action={resendVerificationAction}>
                <button type="submit" className="btn btn-ghost">
                  Resend confirmation code
                </button>
              </form>
            ) : null}
          </div>
        ) : (
          <div className="verify-account">
            <p className="muted">Not signed in?</p>
            <div className="button-row">
              <Link href="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-ghost">
                Sign up
              </Link>
            </div>
          </div>
        )}

        {!(user && !user.emailVerified) ? (
          <Link className="back-link" href={next}>
            Continue to the site
          </Link>
        ) : null}
      </div>
    </section>
  );
}