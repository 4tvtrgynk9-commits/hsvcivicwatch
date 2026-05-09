# Phase 3 — Admin Infrastructure UI

Adds the Admin Infrastructure Desk:

- AI budget status
- draft records from `admin_draft_records`
- social queue from `social_card_queue`
- latest hashtag sets
- poll records
- generate social draft button
- copy caption / hashtags / email
- mark posted / skipped
- on-demand hashtag scout button

AI remains protected by:

```txt
ENABLE_AI_GATEWAY=false
MAX_AI_MONTHLY_USD=30
ADMIN_API_KEY
```

If the local admin page does not show the panel, manually add:

```jsx
import AdminInfrastructurePanel from "../components/AdminInfrastructurePanel";
```

and render:

```jsx
<AdminInfrastructurePanel />
```

inside `src/pages/AdminPanel.jsx`.
