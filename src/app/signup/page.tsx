import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="page-shell auth-shell">
      <div className="auth-card">
        <p className="section-kicker blue-kicker">
          <span>01</span> Become a contributor
        </p>
        <h1>Create your account.</h1>
        <form className="auth-form">
          <label>
            Full name
            <input type="text" name="name" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="Create a password" />
          </label>
          <button type="submit" className="blue-button auth-button">
            Sign up <span>↗</span>
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
        <Link className="back-link" href="/">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
