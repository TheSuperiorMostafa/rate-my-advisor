"use client";

export function ContentRules() {
  return (
    <div className="bg-[#F5F0FF] border border-violet-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-purple-900 mb-2">Review Guidelines</h3>
      <ul className="text-xs text-[#4A2375] space-y-1 list-disc list-inside">
        <li>Reviews must be about the advisor's professional performance only</li>
        <li>No personal contact information (emails, phone numbers, addresses)</li>
        <li>No accusations of crimes or illegal activity</li>
        <li>No medical information or health details</li>
        <li>No hate speech, profanity, or discriminatory language</li>
        <li>Be respectful and constructive in your feedback</li>
      </ul>
      <p className="text-xs text-[#5B2D8B] mt-2">
        Violations may result in your review being removed.
      </p>
    </div>
  );
}


