"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { reviewService } from "@/services/api";
import type { Review } from "@/types/api/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Star, Trash2, Upload, User, Verified, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string | number;
  averageRating?: number;
  reviewCount?: number;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

export const ProductReviews = ({
  productId,
  averageRating = 0,
  reviewCount = 0,
}: ProductReviewsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({ rating: 0, comment: "" });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => reviewService.getProductReviews(productId),
  });

  const reviews = reviewsData?.data?.reviews || [];
  const approvedReviews = reviews.filter((r) => r.is_approved);
  const totalReviews = reviewsData?.data?.total_reviews ?? reviewCount ?? approvedReviews.length;
  const hasApprovedReviews = approvedReviews.length > 0;
  const canSubmitReview = Boolean(user);
  const totalReviewCount = totalReviews ?? 0;

  const revokePreviewUrls = (urls: string[]) => {
    urls.forEach((url) => URL.revokeObjectURL(url));
  };

  const clearImages = () => {
    setSelectedImages([]);
    setImagePreviews((prev) => {
      revokePreviewUrls(prev);
      return [];
    });
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const availableSlots = MAX_IMAGE_COUNT - selectedImages.length;

    if (availableSlots <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGE_COUNT} images.`);
      event.target.value = "";
      return;
    }

    const nextFiles: File[] = [];
    const nextPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/") || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only image files are allowed.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error(`Each image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }

      if (nextFiles.length >= availableSlots) {
        return;
      }

      nextFiles.push(file);
      nextPreviews.push(URL.createObjectURL(file));
    });

    if (!nextFiles.length) {
      event.target.value = "";
      return;
    }

    setSelectedImages((prev) => [...prev, ...nextFiles]);
    setImagePreviews((prev) => [...prev, ...nextPreviews]);

    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== index));
    setImagePreviews((prev) => {
      const urlToRemove = prev[index];
      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleToggleForm = () => {
    if (!user && !showForm) {
      toast.info("Please login to write a review");
    }
    setShowForm((prev) => !prev);
  };

  const createMutation = useMutation({
    mutationFn: (data: ReviewFormData & { images?: File[] }) => {
      if (!user) {
        throw new Error("User must be logged in to submit a review");
      }
      return reviewService.createReview({
        product_id: productId,
        user_id: user.id,
        rating: data.rating,
        comment: data.comment,
        images: data.images,
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      setFormData({ rating: 0, comment: "" });
      clearImages();
      setShowForm(false);
      toast.success(
        response.message ||
          "Review submitted successfully. It will be visible after admin approval."
      );
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to submit review";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Review creation error:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      } else if (typeof error === "object" && error !== null) {
        if ("message" in error) {
          errorMessage = String(error.message);
        }
        console.error("Review creation error object:", error);
      }

      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReviewFormData & { images?: File[] } }) =>
      reviewService.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      setEditingReview(null);
      setFormData({ rating: 0, comment: "" });
      clearImages();
      toast.success("Review updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update review");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      toast.success("Review deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!formData.rating || formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    const payload = { ...formData, images: selectedImages };

    if (editingReview) {
      updateMutation.mutate({ id: editingReview.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({ rating: review.rating, comment: review.review });
    clearImages();
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingReview(null);
    setFormData({ rating: 0, comment: "" });
    clearImages();
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const isUserReview = (review: Review) => {
    if (!user) {
      return false;
    }

    // Normalize IDs to strings for comparison
    const reviewUserId = review.user_id ? String(review.user_id) : null;
    const reviewUserObjectId = review.user?.id ? String(review.user.id) : null;
    const currentUserId = String(user.id);

    // Check multiple ways:
    // 1. Direct user_id match
    // 2. User object id match (from nested user object)
    // 3. Email match (case-insensitive, trimmed)
    const idMatch =
      (reviewUserId && reviewUserId === currentUserId) ||
      (reviewUserObjectId && reviewUserObjectId === currentUserId);

    const emailMatch =
      review.reviewer_email?.toLowerCase().trim() === user.email?.toLowerCase().trim();

    const isMatch = idMatch || emailMatch;

    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Review ownership check:", {
        reviewId: review.id,
        reviewUserId,
        reviewUserObjectId,
        currentUserId,
        idMatch,
        emailMatch,
        isMatch,
        reviewEmail: review.reviewer_email,
        userEmail: user.email,
      });
    }

    return isMatch;
  };

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              {totalReviewCount} {totalReviewCount === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>
        {/* {!user && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )} */}
      </div>

      {/* Compact Two Column Layout - Aligned */}
      <div className={`grid gap-3 ${hasApprovedReviews ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
        {/* Left: Review Form (50%) */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Write a Review</h3>
            <Button
              onClick={handleToggleForm}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
            >
              {showForm ? "Hide" : "Write a Review"}
            </Button>
          </div>
          {showForm ? (
            <div className="border rounded-md p-2 flex-1">
              {canSubmitReview ? (
                <form onSubmit={handleSubmit} className="space-y-2 h-full flex flex-col">
                  <div>
                    <label className="text-xs font-medium mb-0.5 block text-foreground">
                      Rating{" "}
                      {formData.rating > 0 && (
                        <span className="text-muted-foreground">({formData.rating}/5)</span>
                      )}
                    </label>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-3.5 w-3.5 transition-colors ${
                              star <= formData.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 hover:text-amber-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-0.5 block text-foreground">
                      Review
                    </label>
                    <Textarea
                      placeholder="Share your experience..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      rows={2}
                      className="text-xs resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block text-foreground">
                      Photos (optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs cursor-pointer hover:bg-muted">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImagesChange}
                        />
                      </label>
                      <p className="text-[10px] text-muted-foreground">
                        Up to {MAX_IMAGE_COUNT} images, {MAX_IMAGE_SIZE_MB}MB each.
                      </p>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {imagePreviews.map((src, index) => (
                          <div key={`${src}-${index}`} className="relative group">
                            <img
                              src={src}
                              alt={`Selected review image ${index + 1}`}
                              className="h-16 w-full object-cover rounded-md border"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 h-6 text-xs px-2"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "Submitting..."
                        : editingReview
                          ? "Update"
                          : "Submit"}
                    </Button>
                    {editingReview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="h-6 px-2 text-xs"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-2 text-xs text-muted-foreground h-full justify-center">
                  <p>Login to write a review.</p>
                  <div>
                    <Button asChild size="sm" className="h-6 px-2 text-xs">
                      <Link href="/login">Go to login</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-md p-2 flex-1 flex items-center justify-center min-h-[80px]">
              <p className="text-xs text-muted-foreground">
                Tap &quot;Write a Review&quot; to share your feedback
              </p>
            </div>
          )}
        </div>

        {/* Right: Rating Distribution (50%) - Same Structure */}
        {hasApprovedReviews && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Rating Distribution</h3>
              <div className="h-6 w-6" />
            </div>
            <div className="border rounded-md p-2 flex-1 flex flex-col">
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = approvedReviews.filter((r) => r.rating === rating).length;
                  const percentage =
                    approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;

                  return (
                    <div key={rating} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 w-7">
                        <span className="text-xs font-medium text-foreground">{rating}</span>
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 w-14 justify-end">
                        <span className="text-xs font-medium text-foreground">{count}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-1.5 pt-1 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-foreground">{approvedReviews.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Rating Distribution */}
      {approvedReviews.length > 0 && (
        <div className="md:hidden pt-2 border-t">
          <h4 className="text-xs font-semibold mb-2 text-foreground">Rating Distribution</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = approvedReviews.filter((r) => r.rating === rating).length;
              const percentage =
                approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-8">
                    <span className="text-xs font-medium text-foreground">{rating}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reviews List - 2 Column Grid */}
      {isLoading && (
        <div className="text-center text-muted-foreground py-8">Loading reviews...</div>
      )}
      {!isLoading && hasApprovedReviews && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedReviews.map((review) => {
            const reviewImages = Array.from(
              new Set([
                ...((review.media?.map((media) => media?.url).filter(Boolean) as string[]) ?? []),
                ...(review.media_urls ?? []),
                ...(review.images ?? []),
              ])
            ).filter(Boolean);

            return (
              <Card key={review.id} className="h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-sm truncate">
                            {review.reviewer_name}
                          </span>
                          {review.is_verified_purchase && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              <Verified className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isUserReview(review) && (
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEdit(review)}
                          title="Edit review"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(review.id)}
                          title="Delete review"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {review.title && (
                    <h4 className="font-medium text-sm mb-1.5 line-clamp-1">{review.title}</h4>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {review.review}
                  </p>

                  {reviewImages.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {reviewImages.map((src, index) => (
                        <img
                          key={`${review.id}-image-${index}`}
                          src={src}
                          alt={`Review image ${index + 1}`}
                          className="h-16 w-full object-cover rounded-md border"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  )}

                  {review.is_helpful_count > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {review.is_helpful_count} found helpful
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
