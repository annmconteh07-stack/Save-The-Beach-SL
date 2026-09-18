import { submitStoryAction } from "@/lib/actions";

export default function StorySubmissionForm() {
  return (
    <div>
      <form className="auth-form" action={submitStoryAction}>
        <label>
          Title
          <input type="text" name="title" placeholder="What happened at the shoreline?" required />
        </label>
        <label>
          Story
          <textarea name="body" rows={6} placeholder="Tell us what you saw, felt, or learned from the coast..." required />
        </label>
        <label>
          Photo (optional)
          <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" />
        </label>
        <p className="form-message">Upload a photo from your device, or link to one below. Photos up to 15 MB.</p>
        <label>
          Image URL (optional)
          <input type="url" name="imageUrl" placeholder="https://example.com/photo.jpg" />
        </label>
        <button type="submit" className="blue-button auth-button">
          Submit for review <span>↗</span>
        </button>
      </form>
    </div>
  );
}
