"use client";

import { useState, useEffect } from "react";
import { Star, User, Calendar, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  visit_date: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ReviewsSectionProps {
  destinationId: string;
  destinationName: string;
}

function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md"
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-transform hover:scale-110`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-zinc-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({ destinationId, destinationName }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
    visit_date: ""
  });

  useEffect(() => {
    fetchReviews();
  }, [destinationId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          user_id,
          rating,
          title,
          content,
          visit_date,
          created_at,
          profiles (full_name)
        `)
        .eq("destination_id", destinationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
      
      if (user) {
        const existingReview = data?.find((r: any) => r.user_id === user.id);
        if (existingReview) {
          setUserReview(existingReview);
        }
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!newReview.content.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        destination_id: destinationId,
        user_id: user.id,
        rating: newReview.rating,
        title: newReview.title || null,
        content: newReview.content,
        visit_date: newReview.visit_date || null
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("You have already reviewed this destination");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Review submitted successfully!");
      setNewReview({ rating: 0, title: "", content: "", visit_date: "" });
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold font-playfair mb-2">Traveler Reviews</h2>
          <p className="text-zinc-500">What visitors are saying about {destinationName}</p>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-6 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} readonly size="sm" />
              <div className="text-sm text-zinc-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="hidden sm:block space-y-1">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-zinc-500 w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {user && !userReview && (
        <div className="mb-10">
          {!showForm ? (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
            >
              <Star className="w-4 h-4 mr-2" /> Write a Review
            </Button>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800"
              onSubmit={handleSubmit}
            >
              <h3 className="text-xl font-bold mb-6">Share your experience</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                <StarRating 
                  rating={newReview.rating} 
                  onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Review Title</label>
                  <Input
                    placeholder="Sum up your experience"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">When did you visit?</label>
                  <Input
                    type="date"
                    value={newReview.visit_date}
                    onChange={(e) => setNewReview(prev => ({ ...prev, visit_date: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Review *</label>
                <Textarea
                  placeholder="Tell others about your experience..."
                  rows={4}
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  className="rounded-xl resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-full"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Review
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      )}

      {!user && (
        <div className="mb-10 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl text-center">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">Sign in to share your experience</p>
          <Button asChild variant="outline" className="rounded-full">
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
          <Star className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
          <p className="text-zinc-500">Be the first to share your experience at {destinationName}!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{review.profiles?.full_name || "Anonymous Traveler"}</div>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        {review.visit_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Visited {format(new Date(review.visit_date), "MMM yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                </div>
                
                {review.title && (
                  <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                )}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{review.content}</p>
                
                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
                  Reviewed on {format(new Date(review.created_at), "MMMM d, yyyy")}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
