import { submitVolunteerForm } from "@/lib/actions";

export default function VolunteerRegistrationForm() {
  return (
    <div className="registration-form-wrap">
      <form className="registration-form" action={submitVolunteerForm}>
        <label>
          Full name
          <input type="text" name="name" placeholder="Your full name" required />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" placeholder="+232 76 123 456" required />
        </label>
        <label>
          Age
          <input type="number" name="age" placeholder="Your age" min={13} max={120} required />
        </label>
        <label>
          Email
          <input type="email" name="email" placeholder="you@example.com" required />
        </label>
        <button type="submit" className="blue-button auth-button">
          Join the volunteers <span>↗</span>
        </button>
      </form>
    </div>
  );
}