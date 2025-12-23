# Top Nav Search Implementation Summary

## UX Overview

The top navigation now features a RateMyProfessors-style two-mode search system that adapts based on whether a university is selected:

### Mode 1: University Search (No University Selected)
- **Placeholder:** "Search your university..."
- **Results:** Universities only
- **Behavior:** Selecting a university stores it in context and navigates to the university page
- **Additional:** "Browse all universities" link at bottom of dropdown

### Mode 2: Advisor Search (University Selected)
- **Visual:** University pill appears before search box showing selected university name with X to clear
- **Placeholder:** "Search an advisor at [University]..."
- **Results:** Advisors first, then Departments (both filtered to selected university)
- **Behavior:** Selecting advisor/department navigates while maintaining university context

### Context Persistence
- Selected university is stored in localStorage
- Context persists across page navigations and refreshes
- Automatically syncs when visiting a university page
- Can be cleared via X button on pill

---

## Files Created

### 1. Context Management
- **`src/lib/use-university-context.ts`**
  - Hook for managing selected university state
  - Persists to localStorage
  - Provides `setUniversity`, `clearUniversity`, `selectedUniversity`

### 2. Nav Components
- **`src/components/nav/UniversityContextPill.tsx`**
  - Displays selected university as a pill
  - Shows university name (truncated if long)
  - X button to clear context
  - Plum theme styling

- **`src/components/nav/NavSearchBox.tsx`**
  - Main search input component
  - Handles both search modes
  - Debounced search (250ms)
  - Keyboard navigation
  - Context-aware placeholder and results

- **`src/components/nav/NavAutocompleteDropdown.tsx`**
  - Dropdown with grouped results
  - Shows loading skeletons
  - Empty state handling
  - Context-aware result ordering

- **`src/components/nav/NavResultRow.tsx`**
  - Individual result row
  - Type-specific icons and colors
  - Name + subtitle layout

- **`src/components/nav/UniversityContextSync.tsx`**
  - Client component to sync context on university pages
  - Ensures nav shows correct state when visiting university page

---

## Files Modified

### 1. Layout
- **`src/components/layout/Header.tsx`**
  - Replaced `AutocompleteSearch` with `NavSearchBox`
  - Added university pill display
  - Integrated `useUniversityContext` hook
  - Handles university selection callback

### 2. Pages
- **`src/app/u/[universityId]/[slug]/page.tsx`**
  - Added `UniversityContextSync` component
  - Automatically sets context when visiting university page

### 3. API
- **`src/app/api/search/route.ts`**
  - Added `universityId` parameter support
  - Without `universityId`: returns universities only
  - With `universityId`: returns advisors + departments (filtered)
  - Limited to 8 results per group
  - Accepts both `q` and `query` parameters

---

## Component Architecture

```
Header
├── UniversityContextPill (if university selected)
└── NavSearchBox
    └── NavAutocompleteDropdown
        ├── NavResultRow (universities)
        ├── NavResultRow (advisors)
        └── NavResultRow (departments)
```

---

## API Endpoint

### Endpoint
```
GET /api/search?query=<query>&universityId=<id>
```

### Behavior
- **Without `universityId`:**
  - Returns: `{ universities: [...], departments: [], advisors: [] }`
  - Searches universities only
  - Limited to 8 results

- **With `universityId`:**
  - Returns: `{ universities: [], departments: [...], advisors: [...] }`
  - Searches advisors and departments filtered to that university
  - Limited to 8 results per group

### Response Format
```json
{
  "success": true,
  "data": {
    "universities": [
      { "id": "...", "name": "...", "slug": "...", "location": "..." }
    ],
    "departments": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "university": { "id": "...", "name": "...", "slug": "..." }
      }
    ],
    "advisors": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "department": { "id": "...", "name": "...", "slug": "..." },
        "university": { "id": "...", "name": "...", "slug": "..." }
      }
    ]
  }
}
```

---

## Features

### 1. Two-Mode Search
- **University Mode:** Search universities, select to set context
- **Advisor Mode:** Search advisors/departments at selected university

### 2. Context Persistence
- localStorage-based persistence
- Survives page refreshes
- Syncs when visiting university pages
- Can be cleared via pill X button

### 3. Keyboard Navigation
- Arrow keys navigate results
- Enter selects highlighted result
- Escape closes dropdown
- Proper ARIA attributes

### 4. Visual Polish
- University pill with plum theme
- Compact search box
- Loading skeletons
- Empty states
- Grouped results with headers

### 5. Mobile Support
- Responsive layout
- Touch-friendly
- Stacked layout on mobile
- Full-width search

---

## Usage

### Basic Usage (in Header)
The Header component automatically uses the nav search system. No props needed.

### Manual Context Management
```tsx
import { useUniversityContext } from "@/lib/use-university-context";

function MyComponent() {
  const { selectedUniversity, setUniversity, clearUniversity } = useUniversityContext();
  
  // Set university
  setUniversity({ id: "...", name: "...", slug: "..." });
  
  // Clear university
  clearUniversity();
}
```

### Sync Context on University Page
```tsx
import { UniversityContextSync } from "@/components/nav/UniversityContextSync";

export default function UniversityPage({ university }) {
  return (
    <>
      <UniversityContextSync university={university} />
      {/* rest of page */}
    </>
  );
}
```

---

## Dependencies

No new dependencies required. Uses existing:
- `next/navigation` (useRouter, usePathname)
- `lucide-react` (icons)
- `@/lib/utils` (cn utility)
- Browser localStorage API

---

## Testing

See `NAV_SEARCH_QA_CHECKLIST.md` for comprehensive testing checklist.

### Quick Test
1. Visit any page → Type in nav search → Select university → Verify pill appears
2. With university selected → Type advisor name → Verify filtered results
3. Click X on pill → Verify mode switches back
4. Refresh page → Verify context persists

---

## Notes

- **Debounce:** 250ms delay for API calls
- **Result Limit:** 8 results per group for performance
- **localStorage Key:** "rate-my-advisor-selected-university"
- **Context Sync:** Automatically syncs when visiting `/u/[id]/[slug]` pages
- **Accessibility:** Full ARIA support, keyboard navigation, screen reader friendly

---

## Future Enhancements (Optional)

1. **Recent Searches:** Show recent searches in dropdown
2. **Popular Universities:** Show popular universities when input is empty
3. **Search History:** Track search history for analytics
4. **Keyboard Shortcuts:** Add keyboard shortcut to focus search
5. **Context Menu:** Right-click on pill for options (change, clear, etc.)

