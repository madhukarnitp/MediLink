import { useState } from "react";
import { Modal, Button } from "../../../components/ui/UI";

export default function RatingModal({
  doctorName,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onSkip,
  submitting = false,
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Modal closeOnBackdrop={false} priority>
      <div className="relative w-full max-w-[460px] rounded-med bg-white p-5 text-left">
        <button
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-med text-xl text-med-muted hover:bg-med-card2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={submitting}
          onClick={onSkip}
          type="button"
        >
          ×
        </button>
        <h2 className="m-0 pr-8 text-xl font-bold text-med-text">
          Rate Your Consultation
        </h2>
        <p className="mt-1 text-sm text-med-muted">
          How was your experience with {doctorName}?
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <h3 className="mb-2 text-sm font-bold text-med-text">Rating</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-3xl transition ${
                    star <= (hoveredRating || rating)
                      ? "text-amber-400"
                      : "text-slate-300"
                  } disabled:cursor-not-allowed`}
                  disabled={submitting}
                  onClick={() => onRatingChange(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="mt-1 min-h-[18px] text-xs font-semibold text-med-primary">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-med-text">
              Comment (Optional)
            </label>
            <textarea
              className="w-full resize-none rounded-med border border-med-border bg-med-card2 p-3 text-sm text-med-text focus:border-med-primary disabled:cursor-not-allowed disabled:opacity-60"
              value={comment}
              disabled={submitting}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Share your feedback..."
              rows={3}
              maxLength={500}
            />
            <div className="mt-1 text-right text-xs text-med-muted">
              {comment.length}/500
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={submitting} onClick={onSkip}>
              Skip
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
