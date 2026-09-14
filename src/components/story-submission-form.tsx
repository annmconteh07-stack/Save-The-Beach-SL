"use client";

import { useState } from "react";

export default function StorySubmissionForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {submitted ? (
        <div className="success-panel">
          <p className="section-kicker blue-kicker">
            <span>02</span> Submitted
          </p>
          <h3>Your story is awaiting review.</h3>
          <p>We’ll review it and publish it to the journal if it meets the community guide.</p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" name="title" placeholder="What happened at the shoreline?" required />
          </label>
          <label>
            Story
            <textarea name="body" rows={6} placeholder="Tell us what you saw, felt, or learned from the coast..." required />
          </label>
          <label>
            Image URL (optional)
            <input type="url" name="image" placeholder="https://example.com/photo.jpg" />
          </label>
          <button type="submit" className="blue-button auth-button">
            Submit for review <span>↗</span>
          </button>
        </form>
      )}
    </div>
  );
}
