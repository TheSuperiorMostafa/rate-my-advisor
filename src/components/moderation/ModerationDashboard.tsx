"use client";

import { useState, useEffect } from "react";
import { ModerationTabs } from "./ModerationTabs";
import { ReviewModerationCard } from "./ReviewModerationCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

type TabType = "pending" | "approved" | "rejected" | "reports";

interface Review {
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
    department: string;
    university: string;
  };
  ratings: Record<string, number>;
  tags: string[];
  reportCount?: number;
}

export function ModerationDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async (tab: TabType) => {
    setLoading(true);
    setError("");

    try {
      const status = tab === "reports" ? "reported" : tab;
      const res = await fetch(`/api/mod/reviews?status=${status}&limit=50`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch reviews");
      }

      setReviews(data.data?.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(activeTab);
  }, [activeTab]);

  const handleAction = async (reviewId: string, action: "approve" | "reject" | "keep" | "remove", reason?: string) => {
    try {
      if (action === "approve") {
        const res = await fetch(`/api/mod/reviews/${reviewId}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          throw new Error("Failed to approve review");
        }
      } else if (action === "reject") {
        if (!reason) {
          alert("Please provide a rejection reason");
          return;
        }

        const res = await fetch(`/api/mod/reviews/${reviewId}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason, notes: "" }),
        });

        if (!res.ok) {
          throw new Error("Failed to reject review");
        }
      } else if (action === "remove") {
        // Reject the review
        const res = await fetch(`/api/mod/reviews/${reviewId}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "Removed due to reports", notes: "" }),
        });

        if (!res.ok) {
          throw new Error("Failed to remove review");
        }
      } else if (action === "keep") {
        // Resolve reports but keep review
        const res = await fetch(`/api/mod/reports/resolve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewId, action: "dismiss" }),
        });

        if (!res.ok) {
          throw new Error("Failed to resolve reports");
        }
      }

      // Refresh reviews
      await fetchReviews(activeTab);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    }
  };

  const getTabCounts = async () => {
    // This could be optimized with a single API call
    // For now, we'll fetch counts separately
    return {
      pending: 0,
      approved: 0,
      rejected: 0,
      reports: 0,
    };
  };

  return (
    <div>
      <ModerationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title={`No ${activeTab} reviews`}
          description={
            activeTab === "pending"
              ? "All reviews have been moderated"
              : activeTab === "reports"
              ? "No reported reviews"
              : `No ${activeTab} reviews found`
          }
        />
      ) : (
        <div className="space-y-4 mt-6">
          {reviews.map((review) => (
            <ReviewModerationCard
              key={review.id}
              review={review}
              onAction={handleAction}
              showReports={activeTab === "reports"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

