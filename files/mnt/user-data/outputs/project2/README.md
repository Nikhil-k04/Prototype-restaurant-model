# 📝 PostFlow — Post Management System

> **Project 2: Front-End Web Development**
> A React-based mini CRUD blog admin panel with full post management, search, filtering, and routing.

---

## 🖼️ Application Overview

**PostFlow** is a single-page React application for managing blog posts. It provides a clean, editorial design (deep navy + teal accent, DM Serif Display + DM Sans typography) and complete CRUD functionality backed by localStorage.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React 18 | UI components and hooks |
| React Router v6 | Client-side routing |
| Context API | Global state management (posts + toasts) |
| localStorage | Data persistence |
| Vite | Build tool and dev server |
| CSS Custom Properties | Theming and design system |

---

## 📁 File Structure

```
project2/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                   # App entry point
    ├── App.jsx                    # Router + providers
    ├── styles/
    │   └── index.css              # All app styles
    ├── context/
    │   ├── PostsContext.jsx        # Global posts state (Context API)
    │   └── ToastContext.jsx        # Toast notifications state
    ├── data/
    │   └── seedPosts.js            # 12 seed posts (initial data)
    ├── hooks/
    │   └── useLocalStorage.js      # Custom hook for localStorage
    ├── utils/
    │   └── validators.js           # Validation, formatting, ID generation
    ├── components/
    │   ├── Header.jsx              # App header with navigation
    │   ├── PostCard.jsx            # Post card for list view
    │   ├── PostForm.jsx            # Shared create/edit form
    │   ├── Pagination.jsx          # Pagination component
    │   ├── Toast.jsx               # Toast notification display
    │   └── ConfirmModal.jsx        # Delete confirmation dialog
    └── pages/
        ├── PostList.jsx            # / — Post list with search & filter
        ├── PostCreate.jsx          # /posts/new — Create post
        ├── PostEdit.jsx            # /posts/:id/edit — Edit post
        ├── PostView.jsx            # /posts/:id — View post details
        └── NotFound.jsx            # 404 page
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js 18+ 
- npm 9+

### Steps

```bash
# 1. Navigate to the project folder
cd project2

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Visit: http://localhost:5173
```

### Production Build

```bash
npm run build      # Build to /dist
npm run preview    # Preview production build locally
```

---

## 🗺️ Routes

| Route | Page | Description |
|---|---|---|
| `/` | PostList | All posts with search, filter, sort, pagination |
| `/posts/new` | PostCreate | Create a new post |
| `/posts/:id` | PostView | Full post details with tags and timestamps |
| `/posts/:id/edit` | PostEdit | Edit an existing post |
| `*` | NotFound | 404 fallback |

---

## ✅ Features Implemented

### CRUD Operations
- **Create** — Form with validation, auto-save draft to localStorage
- **Read** — Post list (cards) + full post view
- **Update** — Pre-filled edit form with all validations
- **Delete** — Confirmation modal before deletion

### Post List Features
- Client-side **search** by title, content, or author
- **Filter by author** (dropdown)
- **Filter by tag** (dropdown)
- **Sort** by: Newest, Oldest, Title A–Z, Title Z–A
- **Pagination** — 6 posts per page with smart ellipsis
- Clear all filters button

### Form Validation
- Title: required, 5–120 characters
- Author: required, 2–80 characters
- Content: required, minimum 50 characters
- Tags: optional, max 10 tags, max 30 chars each
- Real-time validation on blur
- Character counter on title, content
- Live tag preview as you type

### State Management
- Context API (`PostsContext`) for all posts operations
- Context API (`ToastContext`) for notifications
- `useLocalStorage` custom hook

### Data Persistence
- All posts stored in `localStorage` under `postflow-posts`
- Draft auto-saved every 800ms while typing (new posts only)

### Notifications (Stretch Feature)
- Toast notifications for: create, update, delete operations
- Auto-dismiss after 3.5 seconds
- Manual dismiss button

---

## 🌱 Seed Data

12 initial posts are seeded on first load covering topics:
React Hooks, CSS Grid, TypeScript, Tailwind CSS, JavaScript Promises, React Router, State Management, Accessibility, Performance, Git Workflow, REST APIs, CSS Variables

---

## ♿ Accessibility

- Semantic HTML throughout
- ARIA roles, labels, and live regions
- Focus management in modals
- Keyboard navigation (Escape closes modal, tab order correct)
- Screen reader announcements for dynamic content
- Visible focus indicators

---

## 📊 Evaluation Criteria Alignment

| Criteria | Max | Implementation |
|---|---|---|
| CRUD functionality & routing | 20 | Full CRUD + React Router v6 with 4 routes |
| State management & persistence | 10 | Context API + localStorage seed + draft save |
| UI/UX (forms, validation, feedback) | 15 | Live validation, toasts, pagination, search, filter, empty states |
| Code quality & structure | 10 | Clean folder structure, custom hooks, utility separation |
| Stretch features / tests | 5 | Toast notifications, auto-save drafts, tag sorting |
| **Total** | **60** | |
