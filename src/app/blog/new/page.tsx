import Link from "next/link";
import { redirect } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import StorySubmissionForm from "@/components/story-submission-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewBlogPostPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const error =
    params.error === "invalid-image"
      ? "Please attach an image file (JPG, PNG, WebP, GIF or AVIF), or paste a photo link."
      : params.error === "upload-failed"
        ? "The photo could not be uploaded. Please try a smaller image or paste a photo link instead."
        : null;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=%2Fblog%2Fnew");
  }

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="auth-shell">
        <div className="auth-card wide-card">
          <p className="section-kicker blue-kicker">
            <span>01</span> Share a story
          </p>
          <h1>Submit a beach story.</h1>
          <p className="form-message">
            Posting as {currentUser.name}. Drafts are reviewed before publishing.
          </p>
          {error ? (
            <div className="notice notice-danger" role="alert">
              {error}
            </div>
          ) : null}
          <StorySubmissionForm />
          <Link className="back-link" href="/blog">
            ← Back to journal
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}