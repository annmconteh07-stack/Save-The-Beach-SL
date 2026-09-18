import { createEventAction } from "@/lib/actions";

export default function EventForm() {
  return (
    <form className="auth-form" action={createEventAction}>
      <label>
        Title
        <input type="text" name="title" placeholder="e.g. Lumley Beach sunrise clean-up" required />
      </label>
      <label>
        Description
        <textarea name="description" rows={3} placeholder="What will volunteers do?" required />
      </label>
      <label>
        Date and time
        <input type="datetime-local" name="date" required />
      </label>
      <label>
        Location
        <input type="text" name="location" placeholder="e.g. Lumley Beach, Freetown" required />
      </label>
      <label>
        Capacity limit
        <input type="number" name="capacityLimit" min={0} defaultValue={40} required />
      </label>
      <button type="submit" className="blue-button auth-button">
        Publish event <span>↗</span>
      </button>
    </form>
  );
}