import { submitEventRegistration } from "@/lib/actions";

export default function EventRegistrationForm({ eventId }: { eventId: string }) {
  return (
    <div className="registration-form-wrap">
      <form className="registration-form" action={submitEventRegistration}>
        <input type="hidden" name="eventId" value={eventId} />
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
          Age
          <input type="number" name="age" placeholder="Your age" min={13} max={120} required />
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
    </div>
  );
}
