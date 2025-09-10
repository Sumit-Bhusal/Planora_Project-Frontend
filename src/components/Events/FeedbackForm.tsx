import React, { useState } from "react";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import { useCF } from "../../contexts/CFContext";
import { useNotification } from "../../contexts/NotificationContext";
import * as feedbackApi from "../../services/api/feedback";

interface FeedbackFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  eventId,
  eventTitle,
  onSuccess,
  onCancel,
}) => {
  const { addNotification } = useNotification();
  const { triggerDataSync } = useCF();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sentiment, setSentiment] = useState<
    "positive" | "negative" | "neutral"
  >("neutral");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      addNotification({
        type: "error",
        title: "Rating Required",
        message: "Please provide a rating for this event.",
      });
      return;
    }

    if (!reviewText.trim()) {
      addNotification({
        type: "error",
        title: "Review Required",
        message: "Please write a review for this event.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackApi.createFeedback({
        eventId,
        rating,
        reviewText: reviewText.trim(),
        sentiment,
      });

      addNotification({
        type: "success",
        title: "Review Submitted!",
        message:
          "Thank you for your feedback. It helps improve our recommendations!",
      });

      // Trigger ML data sync to update recommendations immediately
      setTimeout(() => {
        triggerDataSync();
      }, 1000);

      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      addNotification({
        type: "error",
        title: "Submission Failed",
        message: "Failed to submit your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    // Auto-detect sentiment based on rating
    if (value >= 4) {
      setSentiment("positive");
    } else if (value <= 2) {
      setSentiment("negative");
    } else {
      setSentiment("neutral");
    }
  };

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Rate & Review: {eventTitle}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  className={`p-1 rounded-md transition-colors ${
                    value <= rating
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500"
                  }`}
                >
                  <Star className="h-8 w-8 fill-current" />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review *
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Share your experience with this event..."
              required
            />
          </div>

          {/* Sentiment (Auto-detected but allow override) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Overall Experience
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setSentiment("positive")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                  sentiment === "positive"
                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Positive</span>
              </button>
              <button
                type="button"
                onClick={() => setSentiment("neutral")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                  sentiment === "neutral"
                    ? "bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <Minus className="h-4 w-4" />
                <span>Neutral</span>
              </button>
              <button
                type="button"
                onClick={() => setSentiment("negative")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
                  sentiment === "negative"
                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Negative</span>
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !reviewText.trim()}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default FeedbackForm;
