"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TagPills } from "@/components/ui/TagPills";

interface ReviewModerationCardProps {
  review: {
    id: string;
    text: string;
    meetingType: string;
    timeframe: string;
    status: string;
    isVerified: boolean;
    createdAt: string;
    advisor: {
      id: string;
      name: string;
      slug?: string;
      department: string;
      university: string;
    };
    ratings: Record<string, number>;
    tags: string[];
    reportCount?: number;
  };
  onAction: (reviewId: string, action: "approve" | "reject" | "keep" | "remove", reason?: string) => void;
  showReports?: boolean;
}

const meetingTypeLabels: Record<string, string> = {
  in_person: "In-Person",
  virtual: "Virtual",
  email: "Email",
  mixed: "Mixed",
};

const timeframeLabels: Record<string, string> = {
  last_6_months: "Last 6 months",
  "6_12_months": "6-12 months ago",
  "1_2_years": "1-2 years ago",
  "2_plus_years": "2+ years ago",
};

export function ReviewModerationCard({ review, onAction, showReports }: ReviewModerationCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const averageRating =
    Object.values(review.ratings).reduce((sum, rating) => sum + rating, 0) /
    Object.values(review.ratings).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    onAction(review.id, "reject", rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    setIsProcessing(false);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    onAction(review.id, "approve");
    setIsProcessing(false);
  };

  const handleKeep = () => {
    setIsProcessing(true);
    onAction(review.id, "keep");
    setIsProcessing(false);
  };

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this review? This action cannot be undone.")) {
      setIsProcessing(true);
      onAction(review.id, "remove");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Review for {review.advisor.name}
              </h3>
              {review.isVerified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  ✓ Verified Student
                </span>
              )}
              {review.reportCount && review.reportCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  {review.reportCount} {review.reportCount === 1 ? "report" : "reports"}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {review.advisor.department} • {review.advisor.university}
            </p>
            <p className="text-xs text-gray-500">
              Submitted: {formatDate(review.createdAt)}
            </p>
          </div>
          <Link
            href={`/a/${review.advisor.id}${review.advisor.slug ? `/${review.advisor.slug}` : ""}`}
            className="text-sm text-[#5B2D8B] hover:text-[#4A2375] underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Advisor Page →
          </Link>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {averageRating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
            {Object.entries(review.ratings).map(([category, rating]) => (
              <div key={category}>
                <span className="capitalize">{category}:</span>{" "}
                <span className="font-medium">{rating}/5</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700 whitespace-pre-wrap">{review.text}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
          <span>
            <span className="font-medium">Meeting:</span> {meetingTypeLabels[review.meetingType] || review.meetingType}
          </span>
          <span>
            <span className="font-medium">Timeframe:</span> {timeframeLabels[review.timeframe] || review.timeframe}
          </span>
          {review.tags.length > 0 && (
            <div className="flex-1">
              <TagPills
                tags={review.tags.map((tag) => ({
                  id: tag,
                  name: tag,
                  slug: tag.toLowerCase().replace(/\s+/g, "-"),
                }))}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          {showReports ? (
            <>
              <Button
                onClick={handleKeep}
                disabled={isProcessing}
                variant="outline"
                size="sm"
              >
                Keep Review
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              >
                Re-Review
              </Button>
              <Button
                onClick={handleRemove}
                disabled={isProcessing}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                Remove Review
              </Button>
            </>
          ) : review.status === "pending" ? (
            <>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Reject
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              Status: <span className="font-medium capitalize">{review.status}</span>
            </span>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Review</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this review. This reason is for internal use only and will not be shown to the user.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A78BFA] mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                variant="outline"
                size="sm"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                disabled={isProcessing || !rejectReason.trim()}
              >
                {isProcessing ? "Processing..." : "Reject Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

