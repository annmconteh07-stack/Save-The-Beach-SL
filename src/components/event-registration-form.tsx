"use client";

import { useState } from "react";

export default function EventRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="registration-form-wrap">
      {submitted ? (
        <div className="success-panel">
          <p className="section-kicker blue-kicker">
            <span>02</span> Registration saved
          </p>
          <h3>Thanks for joining the cleanup.</h3>
          <p>We’ve saved your spot and we’ll be in touch with the event details.</p>
        </div>
      ) : (
        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" name="name" placeholder="Your full name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" placeholder="+232 76 123 456" required />
          </label>
          <label>
            Emergency contact (optional)
            <input type="text" name="emergencyContact" placeholder="Name and phone number" />
          </label>
          <label>
            Notes (optional)
            <textarea name="notes" rows={4} placeholder="Anything we should know before the cleanup?" />
          </label>
          <button type="submit" className="blue-button auth-button">
            Reserve my spot <span>↗</span>
          </button>
        </form>
      )}
    </div>
  );
}
