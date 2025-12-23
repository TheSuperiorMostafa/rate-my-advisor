# Top Nav Search QA Checklist

## Overview

The top navigation now features a RateMyProfessors-style two-mode search system:
1. **University Mode** (no university selected): Search universities only
2. **Advisor Mode** (university selected): Search advisors and departments at that university

The selected university is persisted in localStorage and shown as a pill with an X to clear.

---

## QA Checklist

### 1. No University Selected (University Mode)

#### Initial State
- [ ] Search input placeholder: "Search your university..."
- [ ] No university pill visible
- [ ] Search bar is compact and fits in nav

#### Typing in Search
- [ ] Typing shows dropdown with autocomplete
- [ ] Dropdown shows "Universities" group header
- [ ] Results show university name and location (if available)
- [ ] Each result has graduation cap icon (plum color)
- [ ] "Browse all universities" link appears at bottom
- [ ] Debounce works (250ms delay)
- [ ] Loading skeleton shows while searching

#### Selecting a University
- [ ] Clicking a university result navigates to `/u/[id]/[slug]`
- [ ] University is stored in localStorage
- [ ] After navigation, nav shows university pill
- [ ] Search mode switches to advisor mode
- [ ] Placeholder changes to "Search an advisor at [University]..."

#### Keyboard Navigation
- [ ] Arrow Down moves selection down
- [ ] Arrow Up moves selection up
- [ ] Enter selects highlighted university
- [ ] Escape closes dropdown
- [ ] Selected item has visual highlight (gray bg + plum ring)

---

### 2. University Selected (Advisor Mode)

#### Initial State
- [ ] University pill appears in nav (before search box)
- [ ] Pill shows university name (truncated if too long)
- [ ] Pill has X button to clear
- [ ] Search input placeholder: "Search an advisor at [University]..."
- [ ] Search bar is compact

#### Typing in Search
- [ ] Dropdown shows "Advisors" group first
- [ ] Then shows "Departments" group
- [ ] Advisors show: name + department name in subtitle
- [ ] Departments show: name + university name in subtitle
- [ ] Results are filtered to selected university only
- [ ] No universities appear in results
- [ ] Loading skeleton shows while searching

#### Selecting Results
- [ ] Clicking advisor navigates to `/a/[id]/[slug]`
- [ ] Clicking department navigates to `/d/[id]/[slug]`
- [ ] University context remains after navigation
- [ ] Dropdown closes after selection

#### Clearing University
- [ ] Clicking X on pill clears university
- [ ] University removed from localStorage
- [ ] Pill disappears
- [ ] Search mode switches back to university mode
- [ ] Placeholder changes to "Search your university..."
- [ ] Search input clears

#### Keyboard Navigation
- [ ] Arrow keys navigate through advisors, then departments
- [ ] Enter selects highlighted result
- [ ] Escape closes dropdown
- [ ] Selected item scrolls into view

---

### 3. Context Persistence

#### Page Load
- [ ] If university in localStorage, pill appears on page load
- [ ] Search mode is correct (advisor mode if university selected)
- [ ] Placeholder is correct for current mode
- [ ] Context persists across page navigations

#### Navigation
- [ ] Navigating to university page sets context automatically
- [ ] Navigating away from university page keeps context
- [ ] Refreshing page restores context from localStorage
- [ ] Clearing context works across all pages

#### localStorage
- [ ] University stored as JSON in localStorage
- [ ] Key: "rate-my-advisor-selected-university"
- [ ] Contains: { id, name, slug }
- [ ] Clearing works correctly
- [ ] No errors if localStorage unavailable

---

### 4. Visual & UX

#### University Pill
- [ ] Plum background (#F5F0FF)
- [ ] Plum border (#A78BFA)
- [ ] Plum text (#5B2D8B)
- [ ] X button is clickable and visible
- [ ] Hover states work
- [ ] Truncates long names with ellipsis
- [ ] Max width prevents nav overflow

#### Search Box
- [ ] Compact size fits in nav
- [ ] Search icon on left
- [ ] Clear button (X) on right when typing
- [ ] Focus ring uses plum color
- [ ] Placeholder text is readable

#### Dropdown
- [ ] Appears below search box
- [ ] Max height with scrolling
- [ ] Group headers are clear
- [ ] Results have proper spacing
- [ ] Icons are aligned correctly
- [ ] Subtitles are muted gray
- [ ] Selected state is clear

#### Loading State
- [ ] Skeleton rows show while loading
- [ ] 3 skeleton rows
- [ ] Smooth animation
- [ ] No layout shift

#### Empty State
- [ ] Shows when no results
- [ ] Helpful message
- [ ] Context-specific hints
- [ ] Centered and readable

---

### 5. Mobile Behavior

#### Layout
- [ ] Search appears below header on mobile
- [ ] University pill appears above search
- [ ] Full width on mobile
- [ ] Touch targets are large enough (44x44px minimum)

#### Interactions
- [ ] Tapping search opens dropdown
- [ ] Tapping result navigates
- [ ] Tapping X on pill clears
- [ ] Dropdown scrolls smoothly
- [ ] No horizontal scrolling issues

#### Responsive
- [ ] Desktop: pill and search inline
- [ ] Mobile: pill and search stacked
- [ ] Breakpoints work correctly
- [ ] No layout breaks

---

### 6. API Integration

#### Endpoint
- [ ] `/api/search?query=<query>&universityId=<id>`
- [ ] Without universityId: returns universities only
- [ ] With universityId: returns advisors + departments
- [ ] Results limited to 8 per group
- [ ] Sorted by relevance

#### Response Format
- [ ] Returns: `{ universities: [], departments: [], advisors: [] }`
- [ ] Universities have: id, name, slug, location
- [ ] Departments have: id, name, slug, university
- [ ] Advisors have: id, name, slug, department, university

#### Error Handling
- [ ] Network errors handled gracefully
- [ ] Empty results show empty state
- [ ] Invalid responses don't crash
- [ ] Loading state clears on error

---

### 7. Routing

#### University Selection
- [ ] Navigates to `/u/[id]/[slug]`
- [ ] Context syncs on university page
- [ ] Nav updates immediately

#### Advisor Selection
- [ ] Navigates to `/a/[id]/[slug]`
- [ ] Context remains
- [ ] Nav stays in advisor mode

#### Department Selection
- [ ] Navigates to `/d/[id]/[slug]`
- [ ] Context remains
- [ ] Nav stays in advisor mode

#### Browse All
- [ ] Navigates to `/search?type=universities`
- [ ] Context cleared (or kept, depending on design)

---

### 8. Edge Cases

#### Empty Query
- [ ] No dropdown when query is empty
- [ ] Dropdown closes when clearing query
- [ ] No API calls for empty query

#### Very Long Names
- [ ] University names truncate in pill
- [ ] Result names truncate with ellipsis
- [ ] Subtitles truncate
- [ ] No layout breaks

#### Rapid Typing
- [ ] Debouncing prevents excessive calls
- [ ] Results update smoothly
- [ ] No race conditions
- [ ] Latest results shown

#### Special Characters
- [ ] Queries with apostrophes work
- [ ] Queries with hyphens work
- [ ] Results properly escaped
- [ ] No XSS issues

#### localStorage Unavailable
- [ ] Graceful degradation
- [ ] No errors thrown
- [ ] Context works for session
- [ ] Clearing works

---

### 9. Accessibility

#### ARIA Attributes
- [ ] Input has `role="combobox"`
- [ ] Input has `aria-expanded`
- [ ] Input has `aria-haspopup="listbox"`
- [ ] Dropdown has `role="listbox"`
- [ ] Results have `role="option"`
- [ ] Selected has `aria-selected="true"`

#### Keyboard Navigation
- [ ] Tab moves focus correctly
- [ ] Arrow keys work
- [ ] Enter works
- [ ] Escape works
- [ ] Focus visible on all elements

#### Screen Reader
- [ ] Placeholder announced
- [ ] Results count announced
- [ ] Selected item announced
- [ ] Group headers announced
- [ ] Clear button labeled

---

### 10. TypeScript

- [ ] No TypeScript errors
- [ ] All types defined
- [ ] Props typed correctly
- [ ] Hooks typed correctly
- [ ] API responses typed

---

## Quick Test Scenarios

1. **Fresh Start → Select University**
   - Visit homepage → Type "stanford" → Select university → Verify pill appears → Type advisor name → Verify filtered results

2. **Clear Context**
   - With university selected → Click X on pill → Verify mode switches → Verify placeholder changes

3. **Page Refresh**
   - Select university → Refresh page → Verify pill still appears → Verify mode is correct

4. **Navigation Flow**
   - Select university → Navigate to advisor page → Verify context remains → Navigate to department → Verify context remains

5. **Keyboard Only**
   - Tab to search → Type query → Use arrows → Press Enter → Verify navigation

---

## Known Limitations

1. **Context Sync**: University context syncs when visiting university page, but not automatically when navigating via other means
2. **Result Limit**: Limited to 8 results per group for performance
3. **Debounce**: 250ms delay may feel slightly slow on fast connections
4. **localStorage**: Requires browser support (gracefully degrades)

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Test URLs:
# Homepage: http://localhost:3000
# University: http://localhost:3000/u/[id]/[slug]
# Advisor: http://localhost:3000/a/[id]/[slug]
# Department: http://localhost:3000/d/[id]/[slug]
```

