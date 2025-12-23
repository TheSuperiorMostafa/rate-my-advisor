# Autocomplete Search Implementation Summary

## Overview

A unified autocomplete search system has been implemented across the entire site. The system provides context-aware search results that adapt based on the current page (global, university, or department context). All search bars now use a single reusable `AutocompleteSearch` component.

---

## Files Created

### 1. API Endpoint
- **`src/app/api/autocomplete/route.ts`**
  - Handles autocomplete search requests
  - Accepts: `query`, `universityId`, `departmentId`
  - Returns grouped results: `{ universities: [], departments: [], advisors: [] }`
  - Implements relevance scoring (startsWith > includes > fuzzy)
  - Person name detection (two capitalized words)
  - Department keyword boosting
  - Context-aware filtering

### 2. Core Components
- **`src/components/search/AutocompleteSearch.tsx`**
  - Main search component with input and dropdown
  - Handles keyboard navigation (arrow keys, Enter, Escape)
  - Debounced search (250ms)
  - Context-aware result ordering
  - Accessible combobox implementation

- **`src/components/search/AutocompleteDropdown.tsx`**
  - Dropdown with grouped results
  - Shows loading skeletons
  - Empty state handling
  - "Search another university" link in context
  - Proper ARIA attributes

- **`src/components/search/AutocompleteResultRow.tsx`**
  - Individual result row component
  - Shows icon, name, and subtitle
  - Type-specific icons and colors
  - Selected state styling

### 3. Utilities
- **`src/lib/use-search-context.ts`**
  - Hook for detecting search context (currently returns empty for header)
  - Type definitions for SearchContext

---

## Files Modified

### 1. Layout Components
- **`src/components/layout/Header.tsx`**
  - Replaced `SearchBar` with `AutocompleteSearch`
  - Added context detection (currently global for header)
  - Desktop and mobile search updated

### 2. Page Components
- **`src/app/page.tsx`**
  - Replaced `SmartSearchBar` with `AutocompleteSearch`
  - Removed filter chips (handled by API ranking)
  - Updated hero and CTA section searches

- **`src/app/u/[universityId]/[slug]/page.tsx`**
  - Replaced `SmartSearchBar` with `AutocompleteSearch`
  - Added university context: `{ universityId, universityName }`
  - Placeholder includes university name

- **`src/app/d/[departmentId]/[slug]/page.tsx`**
  - Replaced `SearchBar` with `AutocompleteSearch`
  - Added department context: `{ universityId, departmentId, universityName }`
  - Placeholder includes department name

---

## Features Implemented

### 1. Context-Aware Search

#### Global Context (Homepage, Header)
- Shows all entity types
- Priority: Universities → Departments → Advisors
- Departments show university in subtitle
- Advisors show "Department • University" in subtitle

#### University Context
- Filters to selected university
- Priority: Advisors → Departments
- Universities group hidden
- "Search another university" link at bottom

#### Department Context
- Filters to selected department/university
- Priority: Advisors in this department → Other advisors → Departments
- Universities group hidden
- "Search another university" link at bottom

### 2. Smart Ranking

- **Relevance Scoring:**
  - Exact match: 100 points
  - Starts with: 80 points
  - Includes: 60 points
  - Word starts with: 40 points

- **Query Type Detection:**
  - Person names (two capitalized words): +30 boost to advisors
  - Department keywords: +20 boost to departments
  - Short queries (0-2 chars): Show top universities only

### 3. Keyboard Navigation

- **Arrow Down/Up:** Navigate through results
- **Enter:** Select highlighted result or submit search
- **Escape:** Close dropdown
- **Tab:** Move focus (dropdown stays open)

### 4. Visual Features

- **Icons:** Type-specific (GraduationCap, Building2, User)
- **Colors:** Plum for universities, blue for departments, teal for advisors
- **Loading:** Skeleton rows during search
- **Empty State:** Helpful messages
- **Selected State:** Gray background + plum ring

### 5. Mobile Support

- Full-width search bars
- Touch-friendly targets
- Scrollable dropdowns
- Responsive layout

---

## API Endpoint Details

### Endpoint
```
GET /api/autocomplete?query=<query>&universityId=<id>&departmentId=<id>
```

### Parameters
- `query` (required): Search query string
- `universityId` (optional): Filter to specific university
- `departmentId` (optional): Filter to specific department

### Response
```json
{
  "success": true,
  "data": {
    "universities": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "location": "..."
      }
    ],
    "departments": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "university": {
          "id": "...",
          "name": "...",
          "slug": "..."
        }
      }
    ],
    "advisors": [
      {
        "id": "...",
        "name": "...",
        "slug": "...",
        "department": {
          "id": "...",
          "name": "...",
          "slug": "..."
        },
        "university": {
          "id": "...",
          "name": "...",
          "slug": "..."
        }
      }
    ]
  }
}
```

---

## Component Usage

### Basic Usage (Global Context)
```tsx
<AutocompleteSearch
  placeholder="Search universities, departments, advisors..."
  size="md"
/>
```

### With Helper Text
```tsx
<AutocompleteSearch
  placeholder="Search a university, department, or advisor..."
  helperText="Start with your university for best results."
  size="lg"
  autoFocus
/>
```

### University Context
```tsx
<AutocompleteSearch
  placeholder={`Find an advisor or department at ${university.name}...`}
  context={{
    universityId: university.id,
    universityName: university.name,
  }}
  autoFocus
/>
```

### Department Context
```tsx
<AutocompleteSearch
  placeholder={`Find an advisor in ${department.name}...`}
  context={{
    universityId: department.university.id,
    departmentId: department.id,
    universityName: department.university.name,
  }}
  autoFocus
/>
```

---

## Dependencies

No new dependencies required. Uses existing:
- `next/navigation` (useRouter, usePathname)
- `lucide-react` (icons)
- `@/lib/utils` (cn utility)
- `@/lib/api-response` (API response helpers)
- `@/lib/rate-limit` (rate limiting)

---

## Testing

See `AUTOCOMPLETE_QA_CHECKLIST.md` for comprehensive testing checklist.

### Quick Test
1. Visit homepage → Type in search → Verify dropdown appears
2. Select university → Verify university page search works
3. Type advisor name → Verify advisors appear first
4. Use arrow keys → Press Enter → Verify navigation

---

## Notes

- **Debounce:** 250ms delay for API calls
- **Result Limit:** 6 results per group (10 for advisors in department context)
- **Context Detection:** Pages pass explicit context; header is always global
- **Accessibility:** Full ARIA support, keyboard navigation, screen reader friendly
- **Performance:** Debounced requests, limited results, efficient queries

---

## Future Enhancements (Optional)

1. **LocalStorage Context:** Remember selected university across sessions
2. **Recent Searches:** Show recent searches in dropdown
3. **Popular Searches:** Show popular searches when input is empty
4. **Fuzzy Matching:** More sophisticated matching algorithms
5. **Search Analytics:** Track popular searches for ranking

