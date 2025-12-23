"use client";

interface ModerationTabsProps {
  activeTab: "pending" | "approved" | "rejected" | "reports";
  onTabChange: (tab: "pending" | "approved" | "rejected" | "reports") => void;
}

export function ModerationTabs({ activeTab, onTabChange }: ModerationTabsProps) {
  const tabs = [
    { id: "pending" as const, label: "Pending", count: null },
    { id: "approved" as const, label: "Approved", count: null },
    { id: "rejected" as const, label: "Rejected", count: null },
    { id: "reports" as const, label: "Reports", count: null },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "border-[#A78BFA] text-[#5B2D8B]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}


