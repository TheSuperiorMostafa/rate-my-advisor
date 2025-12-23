"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewFormSchema, ReviewFormData, checkForContactInfo } from "@/lib/review-validation";
import { StarRatingInput } from "./StarRatingInput";
import { TagSelector } from "./TagSelector";
import { ContentRules } from "./ContentRules";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSession } from "next-auth/react";
import { Captcha } from "@/components/ui/Captcha";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
  advisorId: string;
  advisorSlug: string;
  advisorName: string;
}

async function getTags() {
  try {
    const res = await fetch("/api/tags");
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.tags || [];
  } catch {
    return [];
  }
}

export function ReviewForm({ advisorId, advisorSlug, advisorName }: ReviewFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [tags, setTags] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentWarning, setContentWarning] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaEnabled = process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === "true";
  const captchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      ratings: {
        accuracy: 0,
        responsiveness: 0,
        helpfulness: 0,
        availability: 0,
        advocacy: 0,
        clarity: 0,
      },
      tags: [],
      rulesAccepted: false,
    },
  });

  const watchedText = watch("text");
  const watchedRatings = watch("ratings");

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  // Check for contact info as user types
  useEffect(() => {
    if (watchedText && watchedText.length > 10) {
      const check = checkForContactInfo(watchedText);
      if (check.message) {
        setContentWarning(check.message);
      } else {
        setContentWarning("");
      }
    } else {
      setContentWarning("");
    }
  }, [watchedText]);

  const onSubmit = async (data: ReviewFormData) => {
    // Final check for contact info
    const check = checkForContactInfo(data.text);
    if (check.hasEmail || check.hasPhone) {
      setContentWarning(check.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/advisors/${advisorId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ratings: data.ratings,
          text: data.text,
          meetingType: data.meetingType,
          timeframe: data.timeframe,
          tags: data.tags,
          ...(captchaEnabled && captchaToken && { captchaToken }),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit review");
      }

      // Redirect to success page
      router.push(`/a/${advisorId}/${advisorSlug}/review/success`);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error instanceof Error ? error.message : "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRatingsComplete = Object.values(watchedRatings).every((rating) => rating > 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Ratings Section */}
      <Card variant="elevated">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Rate {advisorName}</h2>
          <p className="text-gray-600">
            Please rate the advisor on each of the following categories (1-5 stars):
          </p>
        </div>

        <div className="space-y-6">
          <StarRatingInput
            label="Accuracy"
            value={watchedRatings.accuracy}
            onChange={(value) => setValue("ratings.accuracy", value)}
            required
          />
          {errors.ratings?.accuracy && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.accuracy.message}</p>
          )}

          <StarRatingInput
            label="Responsiveness"
            value={watchedRatings.responsiveness}
            onChange={(value) => setValue("ratings.responsiveness", value)}
            required
          />
          {errors.ratings?.responsiveness && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.responsiveness.message}</p>
          )}

          <StarRatingInput
            label="Helpfulness"
            value={watchedRatings.helpfulness}
            onChange={(value) => setValue("ratings.helpfulness", value)}
            required
          />
          {errors.ratings?.helpfulness && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.helpfulness.message}</p>
          )}

          <StarRatingInput
            label="Availability"
            value={watchedRatings.availability}
            onChange={(value) => setValue("ratings.availability", value)}
            required
          />
          {errors.ratings?.availability && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.availability.message}</p>
          )}

          <StarRatingInput
            label="Advocacy"
            value={watchedRatings.advocacy}
            onChange={(value) => setValue("ratings.advocacy", value)}
            required
          />
          {errors.ratings?.advocacy && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.advocacy.message}</p>
          )}

          <StarRatingInput
            label="Clarity"
            value={watchedRatings.clarity}
            onChange={(value) => setValue("ratings.clarity", value)}
            required
          />
          {errors.ratings?.clarity && (
            <p className="text-sm text-red-600 mt-1">{errors.ratings.clarity.message}</p>
          )}
        </div>
      </Card>

      {/* Tags Section */}
      <Card variant="elevated">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags (Optional)</h3>
          <p className="text-sm text-gray-600">Select tags that describe your experience</p>
        </div>
        <TagSelector
          tags={tags}
          selected={watch("tags") || []}
          onChange={(selected) => setValue("tags", selected)}
        />
      </Card>

      {/* Meeting Details */}
      <Card variant="elevated">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Meeting Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Meeting Type"
            {...register("meetingType")}
            error={errors.meetingType?.message}
          >
            <option value="">Select meeting type</option>
            <option value="in_person">In-Person</option>
            <option value="virtual">Virtual</option>
            <option value="email">Email</option>
            <option value="mixed">Mixed</option>
          </Select>

          <Select
            label="Timeframe"
            {...register("timeframe")}
            error={errors.timeframe?.message}
          >
            <option value="">Select timeframe</option>
            <option value="last_6_months">Last 6 months</option>
            <option value="6_12_months">6-12 months ago</option>
            <option value="1_2_years">1-2 years ago</option>
            <option value="2_plus_years">2+ years ago</option>
          </Select>
        </div>
      </Card>

      {/* Review Text */}
      <Card variant="elevated">
        <div className="mb-4">
          <ContentRules />
        </div>
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-text"
            {...register("text")}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent resize-none"
            placeholder="Share your experience with this advisor. Be specific and constructive. (Minimum 50 characters)"
            aria-describedby={contentWarning ? "content-warning" : watchedText ? "char-count" : undefined}
          />
          <div className="mt-2 flex items-start justify-between gap-4">
            <div className="flex-1">
              {watchedText && (
                <p id="char-count" className="text-xs text-gray-500">
                  {watchedText.length} / 2000 characters
                </p>
              )}
              {contentWarning && (
                <p id="content-warning" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {contentWarning}
                </p>
              )}
            </div>
          </div>
          {errors.text && (
            <p className="text-sm text-red-600 mt-1">{errors.text.message}</p>
          )}
        </div>
      </Card>

      {/* Verified Student Badge Info */}
      {session?.user?.eduVerified && (
        <Card variant="elevated" className="bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Verified Student Badge
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your review will show a "Verified Student" badge because your .edu email is verified.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* CAPTCHA */}
      {captchaEnabled && captchaSiteKey && (
        <Card variant="elevated">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Verification <span className="text-red-500">*</span>
            </label>
            <Captcha
              siteKey={captchaSiteKey}
              onVerify={setCaptchaToken}
              onError={(error) => {
                console.error("CAPTCHA error:", error);
                setCaptchaToken(null);
              }}
              provider={process.env.NEXT_PUBLIC_CAPTCHA_PROVIDER === "recaptcha" ? "recaptcha" : "hcaptcha"}
            />
            {errors.rulesAccepted && !captchaToken && (
              <p className="text-sm text-red-600 mt-2">Please complete the security verification</p>
            )}
          </div>
        </Card>
      )}

      {/* Rules Acceptance */}
      <Card variant="elevated">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("rulesAccepted")}
            className="mt-1 w-4 h-4 text-[#5B2D8B] border-gray-300 rounded focus:ring-[#A78BFA]"
          />
          <span className="text-sm text-gray-700">
            I understand and agree to the review guidelines above. I confirm that my review
            contains no personal contact information, accusations of crimes, medical information,
            or inappropriate content. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.rulesAccepted && (
          <p className="text-sm text-red-600 mt-2 ml-7">{errors.rulesAccepted.message}</p>
        )}
      </Card>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !allRatingsComplete || !!contentWarning || (captchaEnabled && !captchaToken)}
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
