import Link from "next/link";

import StorySubmissionForm from "@/components/story-submission-form";

export default function NewBlogPostPage() {
  return (
    <main className="page-shell auth-shell">
      <div className="auth-card wide-card">
        <p className="section-kicker blue-kicker">
          <span>01</span> Share a story
        </p>
        <h1>Submit a beach story.</h1>
        <StorySubmissionForm />
        <Link className="back-link" href="/blog">
          ← Back to journal
        </Link>
      </div>
    </main>
  );
}
