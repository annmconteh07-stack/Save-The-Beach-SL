import { addMediaAction } from "@/lib/actions";

export default function MediaForm() {
  return (
    <form className="auth-form" action={addMediaAction}>
      <label>
        Caption
        <input type="text" name="caption" placeholder="e.g. Lumley clean-up, 12 bags collected" required />
      </label>
      <label>
        Photo or video file
        <input
          type="file"
          name="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg,video/quicktime"
        />
      </label>
      <p className="form-message">
        Pick a photo or video from your device and it is saved straight to the site. Photos up to 15&nbsp;MB,
        videos up to 75&nbsp;MB.
      </p>
      <label>
        Or paste an image/video URL
        <input type="url" name="url" placeholder="https://example.com/cleanup.jpg" />
      </label>
      <label>
        Type
        <select name="type" defaultValue="PHOTO">
          <option value="PHOTO">Photo</option>
          <option value="VIDEO">Video</option>
        </select>
      </label>
      <label>
        Category
        <select name="category" defaultValue="">
          <option value="">Uncategorised</option>
          <option value="CLEANUP">Clean-up</option>
          <option value="COMMUNITY_DAY">Community day</option>
        </select>
      </label>
      <button type="submit" className="blue-button auth-button">
        Add to gallery <span>↗</span>
      </button>
    </form>
  );
}