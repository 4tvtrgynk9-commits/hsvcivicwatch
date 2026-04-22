# HSV Civic Watch Handoff

Last updated: 2026-04-17

## Project Identity And Locked Standards

HSV Civic Watch is a civic accountability website for Huntsville, Alabama. The public-facing side should feel serious, credible, prosecutorial, and direct. The admin side should feel more utilitarian and operational, but still consistent with the brand.

### Locked decoder structure for issue cards

- What's Happening — gold
- The Connections — blue
- Who Benefits — lavender
- The Impact — red
- What You Can Do — green

### Locked decoder structure for officials

- The Rise — gold
- The Affiliations — blue
- The Beneficiaries — lavender
- The Track Record — red

### Theme values already remembered

- `sidebarBg` `#193150`
- `gold` `#C6A34D`
- `goldSoft` `#f3ead1`
- `blue` `#2F5D8A`
- decoder/connections blue text `#89C4E8`
- `lavender` `#7A4FA3`
- `red` `#B4473E`
- `redDark` `#7A1F1A`
- `green` `#3E8B5B`
- `text` `#193150`
- `panel` `#f1e8db`
- `border` `#d8cfbf`
- `muted` `#6b778a`

Important distinction:

- dark sidebar/navy blue is for containers/backgrounds
- decoder connections blue `#89C4E8` is the lighter blue used for connection text and should be used as the fill for blue chart bars, not the darker navy blue

## Technical Stack And Workflow

### Stack

- React CRA app
- Vercel deployment
- GitHub repo
- Supabase backend

### Preferred working style

- use Cursor
- use `python3` in terminal for file patching/writes whenever possible
- avoid piecemeal single-line edits if a bigger direct patch is clearer
- build often with `npm run build`
- commit and push in clear small chunks

The user specifically prefers practical terminal-ready instructions and direct copy/paste patches.

## Supabase / Content Model Status

### Existing core tables

`issue_cards`

Typical fields include:

- `id`
- `created_at`
- `module`
- `label`
- `title`
- `summary`
- `details`
- `sources`
- `decoder`
- `actions`
- `ref_number`

Also added/used in this phase:

- `tab`
- `tabs` newer support
- `show_on_overview`
- `visual_score`
- `visual_config`
- `shock_score`
- `module_relevance_score`
- `inline_visual_score`
- `homepage_score`
- `homepage_teaser`
- `published_at`

`stat_blocks`

Typical fields include:

- `id`
- `created_at`
- `module`
- `tab`
- `type`
- `color`
- `data`
- `ref_number`
- `issue_card_ref`
- `strength_score`

### Important note about tabs

The project began moving issue cards from a single-tab model toward multi-tab support.

The intent is:

- issue cards can appear in multiple tabs in the same module
- stat blocks do not need independent multi-tab logic
- stat blocks only need to follow the parent issue card

User direction:

> stat blocks only need to follow the parent, so if they show up in two tabs that's fine

The parent issue card is the source of truth.

## What Was Completed In The Prior Session

### 1. Public homepage ref numbers were removed

Reference numbers should only be visible on the admin side.

Result:

- public homepage no longer shows admin-style ref numbers
- admin still shows them

### 2. Homepage was shifted away from hardcoded filler

The homepage should not show made-up or hardcoded fallback content that is not actually in Supabase.

Final direction:

- homepage active investigations and key numbers should come from Supabase
- if there is not enough qualifying live content, sections should be empty rather than fabricated

### 3. Active Investigations became mini issue cards

Homepage investigation tiles should not behave like vague module links. They should act like mini issue cards that:

- show a title
- show 1-2 punchy, expose-style summary sentences
- make the user want to click into the full issue card

### 4. Homepage teaser support was added

Support was added for:

- parser-generated `homepage_teaser`
- homepage using `homepage_teaser` first, then falling back to `summary`
- admin edit flow exposing `homepage_teaser`

This included:

- `api/parse.js` patching to generate/store teaser
- publish flow patching in `src/pages/AdminPanel.jsx`
- admin edit modal support
- homepage data mapping updated to prefer teaser

Homepage cards should be:

- short
- newsy
- punchy
- slight context
- not chunky full summaries

### 5. Homepage-to-issue-card routing was fixed

Desired flow:

- homepage investigation click
- opens correct module
- switches to correct tab if needed
- scrolls to the exact issue card
- highlights/wiggles that issue card

Implemented pieces included:

- homepage investigation payload includes module/tab/card context
- localStorage targeting via `hsv_last_card`
- module pages honor saved target tab
- issue cards read target state and scroll into view

### 6. Public issue card arrival effect was implemented

Desired behavior:

- blue glow ring
- blue border tint
- 3 wiggles
- then the effect disappears

This was implemented in `src/components/IssueCard.jsx`.

### 7. Mobile issue-card landing was improved

Known problem area:

- `scrollIntoView()` timing issues
- fixed mobile header offset
- landing too low or overshooting

Behavior improved, though this area may still need future fine-tuning depending on device/browser behavior.

### 8. Decoder persistence/navigation behavior was improved

Desired behavior:

- decoder should not remain open just because the user navigated to another module normally
- decoder should reopen only in deliberate return flows, not just because it was once opened

Relevant files included `src/components/IssueCard.jsx` and `src/App.jsx`.

### 9. Investigative Trail label was restored

User-facing label should say `Investigative Trail`, not `Sources`.

Important:

- internally source arrays are still called `sources`
- do not relabel the user-facing section back to `Sources`

Corrected in `src/components/InvestigativeTrail.jsx`.

### 10. Blue chart bar fill was corrected

Blue chart bars should use the lighter decoder/connections blue:

- `#89C4E8`

This specifically applies to chart/bar fills, not the dark container background.

### 11. Admin success feedback was simplified

Repeated attempts to make admin rows wiggle/highlight like public issue cards were unsatisfying.

Final direction:

- remove the green row highlight/wiggle attempts
- keep only the small success feedback bubble/toast
- do not keep pushing on admin wiggle right now

### 12. Multi-tab issue card support was started and largely wired

Work completed:

- `tabs[]` support was added/planned in data flow
- `src/lib/useSupabaseModule.js` updated to read `tabs`
- admin edit state updated to hold `tabs`
- render logic in module pages updated to check `tabs`
- publish flow updated to save `tabs`

This is one of the most important structural changes made.

### 13. Parent-follow cascade logic for stat blocks was implemented in code

If an issue card changes:

- module
- primary tab
- visible tabs

Then linked stat blocks should follow the parent automatically.

Expected cascade behavior:

- if module changes, ref number should update
- linked stat blocks should move module too
- linked stat blocks should update `issue_card_ref`
- stat block refs should regenerate if module prefix changes
- linked stat blocks should follow parent tab/module alignment

This logic was implemented in `api/update.js`.

Also:

- `src/pages/AdminPanel.jsx` save flow already contains `payload.cascaded_stats` refresh logic

Important:

- implemented but not end-to-end verified yet

## What Was Attempted But Intentionally Dropped

### Admin wiggle/highlight behavior

Final direction:

- no green row highlight/wiggle for now
- keep admin utilitarian
- keep only success bubble/toast
- maybe revisit later only if explicitly requested

## Current Codebase Status

### Build status

At the end of the prior session:

- `npm run build` succeeded

### Git status

At the point the session ended:

- there were no pending tracked changes
- only local `build/` was untracked

Meaning:

- code changes were already committed/pushed
- do not commit `build/`

## Implemented But Unverified

These behaviors are implemented in code but were not fully tested end to end that night.

### 1. Multi-tab issue card behavior

Expected behavior:

- one issue card can live in both `overview` and `schools`
- renders in both

Status:

- plumbing is largely there
- not manually verified

### 2. Parent-follow stat block behavior

Expected behavior:

- stat blocks follow the parent issue card when parent module/tab changes
- if parent appears in multiple tabs, child following that is acceptable

Status:

- code path exists
- not manually verified

### 3. Module/ref cascade behavior

Expected behavior:

- move issue card to another module
- issue card gets new ref number
- linked stat blocks follow module
- linked stat blocks update `issue_card_ref`
- linked stat block refs regenerate if needed

Status:

- code path exists in `api/update.js`
- not manually verified

These should be treated as implemented but unverified.

## Practical Instruction For The Next Session

The site is far enough along to start content work now.

Recommended practical approach:

- start researching and uploading issue cards now
- use intended module/tab the first time when possible
- use `homepage_teaser` when appropriate
- avoid doing a lot of complicated cross-module moves immediately if it can be avoided
- if a module move becomes necessary later, the cascade logic is there, but it may need cleanup if bugs appear

## Highest Remaining Functional Items

1. Verify multi-tab issue card behavior
2. Verify parent-follow stat block behavior
3. Verify module/ref cascade behavior
4. Admin auth/security cleanup

## Auth/Security Cleanup Still Pending

Needs future work:

- changeable admin password
- remove fragile hardcoded password patterns
- add proper auth
- choose the cheapest practical 2-factor authentication path

This was not completed in the prior session.

## Important User Preferences To Preserve

### Content / research formatting

The user has a strict admin research template and expects:

- verified info only
- write `UNKNOWN` if not found
- produce as many issue cards/stat blocks as research supports

### Language style

The user wants:

- plain language
- easy enough for about an 8th grader to understand
- acronyms expanded at least once
- clear local context
- no vague shorthand like assuming they know `TIF` means Tax Increment Financing
- prefer rounded clear figures like `over 523k` or `+523k` instead of ugly precision like `523,641` in titles/stat blocks

### Stat block guidance

The user does not want stat blocks that require paragraphs of explanation.

Preferred style:

- immediate contrast
- fast understanding
- visually obvious

Examples the user liked:

- `Jemison vs Grissom`
- `Columbia vs Huntsville High`
- same district, unequal results
- `6% & 12% vs 31% & 43%`

### Visual guidance

Public-site targeted issue card behavior is locked more clearly than admin:

- public target card should glow/wiggle when reached from homepage investigation click
- admin should remain more utilitarian

### Workflow preference

The user likes:

- direct terminal commands
- patch blocks
- `python3` file edits in terminal
- build often
- not having to hunt for tiny instructions in scattered messages

## Files Central To The Prior Session

Public routing / homepage / issue cards:

- `src/components/DashboardHome.jsx`
- `src/lib/useHomepageData.js`
- `src/components/IssueCard.jsx`
- `src/App.jsx`

Module rendering / live data:

- `src/lib/useSupabaseModule.js`
- module page files under `src/modules/`

Homepage teaser / parse / publish:

- `api/parse.js`
- `src/pages/AdminPanel.jsx`

Investigative Trail label:

- `src/components/InvestigativeTrail.jsx`

Visual/chart colors:

- `src/components/IssueCard.jsx`

Admin edit/update/cascade:

- `src/pages/AdminPanel.jsx`
- `api/update.js`

## Safe Next Steps

1. Acknowledge that homepage and routing work is largely done, issue-card uploads can begin, and tab/module/ref-follow logic is implemented but unverified.
2. Either begin research/content creation immediately or verify the 3 unverified behaviors:
   issue card in multiple tabs, issue card moved to another module, issue card primary tab changed and linked stat follows.
3. After that, tackle admin auth/security cleanup.

## One-Paragraph Summary

The homepage now uses real Supabase content instead of fake filler, Active Investigations behave like mini issue-card entries, homepage clicks route into the exact module/tab/card, homepage teaser support and admin editing were added, Investigative Trail was restored as the public label, blue chart fills were corrected to the lighter decoder blue, public issue-card arrival highlighting was implemented, multi-tab issue card support was started and mostly wired, and server-side parent-follow cascade logic was added so linked stat blocks should follow issue card module/tab/ref changes. The app was building successfully at the end of that session. Remaining functional work is mainly verification of the new tab/cascade behavior, then admin auth/security cleanup.
