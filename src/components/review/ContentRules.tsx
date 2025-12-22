"use client";

export function ContentRules() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">Review Guidelines</h3>
      <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
        <li>Reviews must be about the advisor's professional performance only</li>
        <li>No personal contact information (emails, phone numbers, addresses)</li>
        <li>No accusations of crimes or illegal activity</li>
        <li>No medical information or health details</li>
        <li>No hate speech, profanity, or discriminatory language</li>
        <li>Be respectful and constructive in your feedback</li>
      </ul>
      <p className="text-xs text-blue-700 mt-2">
        Violations may result in your review being removed.
      </p>
    </div>
  );
}

