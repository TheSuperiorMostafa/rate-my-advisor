# Autocomplete Search QA Checklist

## Overview

The autocomplete search is now implemented across the entire site using a single reusable `AutocompleteSearch` component. It provides context-aware search results that adapt based on the current page (global, university, or department context).

---

## QA Checklist by Location

### 1. Top Navigation (Header)

**Location:** `src/components/layout/Header.tsx`

#### Desktop Search
- [ ] Search bar appears in header on all non-home pages
- [ ] Placeholder: "Search universities, departments, advisors..."
- [ ] Typing shows dropdown with grouped results
- [ ] Results show: Universities, Departments, Advisors groups
- [ ] Each result has icon, name, and subtitle
- [ ] Keyboard navigation works (arrow keys, Enter, Escape)
- [ ] Clicking result navigates correctly
- [ ] Search is global (no context filtering)

#### Mobile Search
- [ ] Search bar appears below header on mobile
- [ ] Same functionality as desktop
- [ ] Dropdown fits on screen
- [ ] Touch targets are large enough

---

### 2. Homepage Hero Search

**Location:** `src/app/page.tsx`

- [ ] Large search bar in hero section
- [ ] Placeholder: "Search a university, department, or advisor..."
- [ ] Helper text: "Start with your university for best results."
- [ ] Auto-focused on page load
- [ ] Typing shows dropdown
- [ ] Results prioritized: Universities → Departments → Advisors
- [ ] Short queries (0-2 chars) show top universities
- [ ] Person name queries (e.g., "John Smith") prioritize advisors
- [ ] Department keywords (e.g., "engineering") boost departments
- [ ] All navigation works correctly

---

### 3. University Page Search

**Location:** `src/app/u/[universityId]/[slug]/page.tsx`

- [ ] Placeholder includes university name: "Find an advisor or department at [University]..."
- [ ] Auto-focused on page load
- [ ] Results are filtered to the selected university
- [ ] Results prioritized: Advisors → Departments
- [ ] Universities group is hidden (context is known)
- [ ] "Search another university..." link appears at bottom
- [ ] Clicking "Search another university" navigates to homepage
- [ ] All results show correct subtitles (department • university for advisors)
- [ ] Keyboard navigation includes the "Search another university" link

---

### 4. Department Page Search

**Location:** `src/app/d/[departmentId]/[slug]/page.tsx`

- [ ] Placeholder includes department name: "Find an advisor in [Department]..."
- [ ] Auto-focused on page load
- [ ] Results are filtered to the selected department/university
- [ ] Results prioritized: Advisors in this department first, then other advisors in university
- [ ] Departments group shows other departments in the university
- [ ] Universities group is hidden
- [ ] "Search another university..." link appears at bottom
- [ ] All navigation works correctly

---

### 5. Advisor Page

**Location:** `src/app/a/[advisorId]/[slug]/page.tsx`

- [ ] No search bar on advisor page (uses header search)
- [ ] Header search works globally
- [ ] Can search for other advisors/departments from advisor page

---

## Functional Testing

### Context-Aware Results

#### Global Context (Homepage, Header)
- [ ] Universities appear first
- [ ] Departments show university in subtitle
- [ ] Advisors show "Department • University" in subtitle
- [ ] All entity types are searchable

#### University Context
- [ ] Only advisors and departments from that university appear
- [ ] Advisors appear first
- [ ] Departments appear second
- [ ] Universities group is hidden
- [ ] "Search another university" link works

#### Department Context
- [ ] Advisors in current department appear first
- [ ] Other advisors in university appear after
- [ ] Other departments in university appear
- [ ] Universities group is hidden
- [ ] "Search another university" link works

---

### Search Behavior

#### Query Types

- [ ] **Short query (0-2 chars)**
  - Shows top universities (if available)
  - No other results

- [ ] **University name (e.g., "stanford")**
  - Universities appear first
  - Matching departments appear
  - Matching advisors appear

- [ ] **Person name (e.g., "John Smith")**
  - Advisors prioritized
  - Still shows universities and departments if they match

- [ ] **Department keyword (e.g., "engineering")**
  - Departments boosted in results
  - Still shows all matching types

- [ ] **Advisor name (e.g., "Smith")**
  - Shows matching advisors
  - Shows matching departments/universities if they match

---

### Keyboard Navigation

- [ ] **Arrow Down**
  - Moves selection down
  - Wraps to top when at bottom
  - Scrolls selected item into view

- [ ] **Arrow Up**
  - Moves selection up
  - Wraps to bottom when at top
  - Scrolls selected item into view

- [ ] **Enter**
  - If result selected: navigates to that result
  - If no result selected: navigates to search page
  - Closes dropdown after navigation

- [ ] **Escape**
  - Closes dropdown
  - Keeps query text in input

- [ ] **Tab**
  - Moves focus to next element
  - Dropdown remains open if query has results

---

### Visual & UX

- [ ] **Loading State**
  - Shows skeleton rows (3 rows)
  - "Searching..." message appears
  - Smooth transition

- [ ] **Empty State**
  - Shows when no results found
  - Helpful message: "No results found for '[query]'"
  - Context-specific hints (e.g., "Try searching for advisors at [University]")

- [ ] **Result Display**
  - Icons are correct (GraduationCap, Building2, User)
  - Icons are color-coded (plum, blue, teal)
  - Names are bold and readable
  - Subtitles are muted gray
  - Text truncates with ellipsis if too long

- [ ] **Selected State**
  - Selected item has gray background
  - Selected item has plum ring
  - Visual feedback is clear

- [ ] **Group Headers**
  - "Universities (X)", "Departments (X)", "Advisors (X)"
  - Uppercase, small, gray text
  - Clear separation between groups

---

### Mobile Testing

- [ ] **Touch Interactions**
  - Tapping search bar opens dropdown
  - Tapping result navigates immediately
  - Dropdown is scrollable
  - No horizontal scrolling issues

- [ ] **Layout**
  - Search bar is full width
  - Dropdown is full width
  - Results are readable
  - Touch targets are at least 44x44px

- [ ] **Performance**
  - No lag when typing
  - Debounce works (250ms)
  - Smooth scrolling

---

### Edge Cases

- [ ] **Very long queries**
  - Layout doesn't break
  - Text truncates properly
  - Results still show

- [ ] **Special characters**
  - Queries with apostrophes, hyphens work
  - Results are properly escaped
  - No XSS issues

- [ ] **Rapid typing**
  - Debouncing prevents excessive API calls
  - Results update smoothly
  - No race conditions

- [ ] **Network errors**
  - Graceful error handling
  - User sees helpful message
  - Can retry search

- [ ] **Empty database**
  - Shows "No results found" appropriately
  - No errors thrown

---

### Accessibility

- [ ] **ARIA Attributes**
  - Input has `role="combobox"`
  - Input has `aria-expanded`
  - Input has `aria-haspopup="listbox"`
  - Dropdown has `role="listbox"`
  - Each result has `role="option"`
  - Selected item has `aria-selected="true"`

- [ ] **Screen Reader**
  - Screen reader announces result count
  - Selected item is announced
  - Group headers are announced
  - Navigation is clear

- [ ] **Focus Management**
  - Focus visible on all interactive elements
  - Focus returns to input after closing
  - Keyboard navigation works without mouse

- [ ] **Color Contrast**
  - All text meets WCAG AA standards
  - Icons have sufficient contrast
  - Selected state is clear

---

### Performance

- [ ] **Debouncing**
  - 250ms delay before API call
  - No excessive requests
  - Smooth user experience

- [ ] **API Response**
  - Results return quickly (< 500ms)
  - Limited to 6 results per group
  - No pagination needed for autocomplete

- [ ] **Rendering**
  - Dropdown renders smoothly
  - No janky scrolling
  - Smooth animations

---

## Integration Points

### API Endpoint

**Location:** `src/app/api/autocomplete/route.ts`

- [ ] Endpoint accepts: `query`, `universityId`, `departmentId`
- [ ] Returns: `{ universities: [], departments: [], advisors: [] }`
- [ ] Handles empty queries gracefully
- [ ] Implements relevance scoring
- [ ] Person name detection works
- [ ] Department keyword boosting works
- [ ] Context filtering works correctly

### Component Usage

- [ ] `AutocompleteSearch` is used in:
  - [ ] Header (desktop + mobile)
  - [ ] Homepage hero
  - [ ] Homepage CTA section
  - [ ] University page
  - [ ] Department page

- [ ] Context is passed correctly:
  - [ ] Global context (no props) on homepage/header
  - [ ] University context on university page
  - [ ] Department context on department page

---

## Browser Testing

- [ ] **Chrome/Edge** (Chromium)
  - All features work
  - Keyboard navigation works
  - No console errors

- [ ] **Firefox**
  - All features work
  - Keyboard navigation works
  - No console errors

- [ ] **Safari**
  - All features work
  - Keyboard navigation works
  - No console errors

- [ ] **Mobile Safari** (iOS)
  - Touch interactions work
  - Dropdown displays correctly
  - No layout issues

- [ ] **Mobile Chrome** (Android)
  - Touch interactions work
  - Dropdown displays correctly
  - No layout issues

---

## Known Limitations

1. **Context Detection in Header**: Header search is always global. Pages pass explicit context.
2. **Result Limit**: Limited to 6 results per group for performance.
3. **Debounce**: 250ms delay - may feel slightly slow on fast connections.
4. **Person Name Detection**: Basic (two capitalized words) - may have false positives.

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Test URLs:
# Homepage: http://localhost:3000
# University: http://localhost:3000/u/[id]/[slug]
# Department: http://localhost:3000/d/[id]/[slug]
# Advisor: http://localhost:3000/a/[id]/[slug]
```

---

## Quick Test Scenarios

1. **Homepage → University Flow**
   - Type "stanford" → Select university → Verify university page search works

2. **University → Department Flow**
   - On university page → Type department name → Select department → Verify department page search works

3. **Direct Advisor Search**
   - On homepage → Type "John Smith" → Verify advisors appear first → Select advisor

4. **Context Switching**
   - On university page → Click "Search another university" → Verify navigation to homepage

5. **Keyboard Navigation**
   - Type query → Use arrow keys → Press Enter → Verify navigation

