# Search UX QA Checklist

## UX Overview

The search flow implements a "university-first" approach similar to RateMyProfessors, while still supporting power users who want to search directly for advisors or departments. The homepage features a single search bar with helper text, and results are intelligently grouped and ranked based on query characteristics. Filter chips allow users to narrow results by type. After selecting a university, the university page provides a focused search for advisors and departments within that context.

---

## QA Checklist

### 1. Default State (Homepage)

- [ ] **Empty search bar**
  - Search bar displays placeholder: "Search a university, department, or advisor..."
  - Helper text appears below: "Start with your university for best results."
  - Filter chips show: "All" (selected), "Universities", "Departments", "Advisors"
  - No dropdown visible when input is empty

- [ ] **Short query (0-2 characters)**
  - Typing 1-2 characters shows dropdown
  - Dropdown displays "Top Universities" section
  - Shows up to 6 top universities (alphabetical or popular)
  - "Browse all universities" link appears at bottom
  - No other result types shown for short queries

- [ ] **Filter chip selection**
  - Clicking "Universities" chip filters to show only universities
  - Clicking "Departments" chip filters to show only departments
  - Clicking "Advisors" chip filters to show only advisors
  - "All" shows all result types
  - Active chip has plum background (#5B2D8B), inactive chips are gray

### 2. University-First Flow

- [ ] **Typing university name (3+ chars)**
  - Query like "stanford" or "MIT" shows results
  - Universities group appears first in dropdown
  - Each university result shows:
    - University name (bold)
    - Location or department count as secondary label
    - Graduation cap icon (plum color)
  - Results are grouped with header "Universities (X)"

- [ ] **Selecting a university**
  - Clicking a university result navigates to `/u/[id]/[slug]`
  - Dropdown closes after selection
  - Search bar clears

- [ ] **University page search**
  - Placeholder: "Find an advisor or department at [University Name]..."
  - Search bar is auto-focused
  - Typing shows advisors first, then departments
  - Results are scoped to the selected university
  - Filter chips work the same way

### 3. Advisor-Name Query Flow

- [ ] **Person name detection**
  - Query like "John Smith" (two capitalized words) prioritizes advisors
  - Advisors group appears first in dropdown
  - Each advisor result shows:
    - Full name (bold)
    - "Department • University" as secondary label
    - User icon (teal color)

- [ ] **Advisor results**
  - Results are sorted by university, then department, then name
  - Clicking navigates to `/a/[id]/[slug]`
  - Dropdown closes after selection

### 4. Keyboard Navigation

- [ ] **Arrow keys**
  - Down arrow moves selection down through results
  - Up arrow moves selection up through results
  - Selection wraps (last item → first item, first item → last item)
  - Selected item has gray background and plum ring
  - Selected item scrolls into view automatically

- [ ] **Enter key**
  - Pressing Enter on selected item navigates to that result
  - If no item selected, Enter submits search (navigates to `/search?q=...`)

- [ ] **Escape key**
  - Pressing Escape closes dropdown
  - Search bar retains query text

- [ ] **Tab key**
  - Tab moves focus to next element (filter chips or other page elements)
  - Dropdown remains open if query has results

### 5. Mobile Behavior

- [ ] **Touch interactions**
  - Tapping search bar opens dropdown
  - Tapping result navigates immediately
  - Filter chips are tappable and responsive
  - Dropdown scrolls smoothly on mobile

- [ ] **Layout**
  - Search bar is full width on mobile
  - Filter chips wrap to multiple lines if needed
  - Dropdown is full width and scrollable
  - Results are touch-friendly (adequate tap targets)

- [ ] **Performance**
  - Search debounces (300ms delay)
  - Loading state shows "Searching..." message
  - No lag when typing quickly

### 6. Edge Cases

- [ ] **No results**
  - Query with 2+ chars and no matches shows: "No results found for '[query]'"
  - Empty state is centered and readable

- [ ] **Special characters**
  - Queries with special chars (e.g., "O'Brien", "St. John's") work correctly
  - Results are properly escaped and displayed

- [ ] **Very long queries**
  - Long queries don't break layout
  - Results truncate with ellipsis if needed

- [ ] **Rapid typing**
  - Debouncing prevents excessive API calls
  - Results update smoothly

### 7. Accessibility

- [ ] **ARIA attributes**
  - Input has `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`
  - Dropdown has `role="listbox"`, `aria-label="Search results"`
  - Each result has `role="option"`, `aria-selected`

- [ ] **Screen reader**
  - Screen reader announces result count
  - Selected item is announced
  - Group headers are announced

- [ ] **Focus management**
  - Focus returns to input after closing dropdown
  - Focus visible on all interactive elements
  - Keyboard navigation works without mouse

### 8. Visual Polish

- [ ] **Icons**
  - Universities: Graduation cap (plum #5B2D8B)
  - Departments: Building icon (blue)
  - Advisors: User icon (teal)
  - Icons are consistent size and alignment

- [ ] **Spacing**
  - Results have consistent padding (12px)
  - Groups have clear separation
  - Filter chips have adequate spacing

- [ ] **Colors**
  - Active filter chip: plum (#5B2D8B) background, white text
  - Inactive chips: gray background, gray text
  - Hover states work on all interactive elements
  - Focus rings use accent color (#A78BFA)

### 9. Integration

- [ ] **Homepage**
  - Search bar appears in hero section
  - Helper text is visible
  - Top universities load correctly

- [ ] **University page**
  - Search bar appears below university header
  - Placeholder includes university name
  - Results are scoped correctly

- [ ] **Navigation**
  - All result links work correctly
  - Breadcrumbs update appropriately
  - Back button works as expected

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Test URLs:
# Homepage: http://localhost:3000
# University page: http://localhost:3000/u/[id]/[slug]
# Search page: http://localhost:3000/search?q=test
```

---

## Known Issues / Notes

- Top universities are currently limited to 6 (can be adjusted)
- Search debounce is 300ms (can be tuned for performance)
- Person name detection is basic (two capitalized words) - can be enhanced
- University page search requires university context (universityId prop)

