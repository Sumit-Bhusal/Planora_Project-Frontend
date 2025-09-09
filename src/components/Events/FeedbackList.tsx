import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Calendar, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import Card from '../UI/Card';
import * as feedbackApi from '../../services/api/feedback';

interface FeedbackListProps {
  eventId: string;
  showTitle?: boolean;
}

interface FeedbackItemProps {
  feedback: feedbackApi.Feedback;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback }) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {feedback.user?.name || 'Anonymous User'}
            </span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-4 w-4 ${
                    value <= feedback.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border">
              <span className={getSentimentColor(feedback.sentiment)}>
                {getSentimentIcon(feedback.sentiment)}
                <span className="ml-1 capitalize">{feedback.sentiment}</span>
              </span>
            </span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
            {feedback.reviewText}
          </p>
          
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(feedback.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackList: React.FC<FeedbackListProps> = ({ eventId, showTitle = true }) => {
  const [feedbacks, setFeedbacks] = useState<feedbackApi.Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await feedbackApi.getEventFeedbacks(eventId);
        setFeedbacks(data);
      } catch (err) {
        console.error('Failed to load feedbacks:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, [eventId]);

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
    : 0;

  const sentimentCounts = feedbacks.reduce((counts, feedback) => {
    counts[feedback.sentiment] = (counts[feedback.sentiment] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </Card>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to share your experience with this event!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {showTitle && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reviews & Ratings
            </h3>
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-5 w-5 ${
                        value <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({feedbacks.length} review{feedbacks.length !== 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{sentimentCounts.positive || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                  <Minus className="h-4 w-4" />
                  <span>{sentimentCounts.neutral || 0}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{sentimentCounts.negative || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FeedbackList;
