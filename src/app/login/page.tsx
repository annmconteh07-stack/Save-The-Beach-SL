import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="page-shell auth-shell">
      <div className="auth-card">
        <p className="section-kicker blue-kicker">
          <span>01</span> Contributor login
        </p>
        <h1>Welcome back.</h1>
        <form className="auth-form">
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="blue-button auth-button">
            Log in <span>↗</span>
          </button>
        </form>
        <p className="auth-switch">
          Need an account? <Link href="/signup">Create one</Link>
        </p>
        <Link className="back-link" href="/">
          ← Back home
        </Link>
      </div>
    </main>
  );
}
