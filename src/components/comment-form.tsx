import { submitCommentAction } from "@/lib/actions";

export default function CommentForm({ postId }: { postId: string }) {
  return (
    <div className="comment-form-wrap">
      <form className="registration-form" action={submitCommentAction}>
        <input type="hidden" name="postId" value={postId} />
        <label>
          Add a comment
          <textarea
            name="body"
            rows={3}
            placeholder="Share your thoughts on this story..."
            maxLength={1000}
            minLength={1}
            required
          />
        </label>
        <button type="submit" className="blue-button auth-button">
          Post comment <span>↗</span>
        </button>
      </form>
    </div>
  );
}