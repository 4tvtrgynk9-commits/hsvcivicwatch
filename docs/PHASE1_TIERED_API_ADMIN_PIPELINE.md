# Phase 1 — Tiered API + Admin Pipeline Infrastructure

This phase wires the structural system now, including tiered API readiness and a hard monthly cost cap.

## Monthly cap

Default combined AI cap:

```txt
MAX_AI_MONTHLY_USD=30
```

This cap applies across Anthropic, Gemini, and DeepSeek usage logged through the gateway.

## Model roles

Code handles deterministic work:
- parser wrappers
- field validation
- source records
- claim records
- estimate records
- relationship records
- readiness scoring
- first-pass 50-point impact/absurdity scoring

Cheap model handles clerk work:
- tag cleanup
- container routing
- duplicate detection
- field normalization
- profile/card linking suggestions
- monthly missing-field grouping

Claude / strong model handles risk work:
- claim safety
- relationship validation
- public wording review
- Veritas satire risk review
- estimate defensibility
- disputed scoring

## Keep gateway disabled first

Set:

```txt
ENABLE_AI_GATEWAY=false
```

Turn it on only after admin buttons are wired.

## Added endpoints

```txt
POST /api/parse-structured-packet
GET  /api/ai-budget-status
POST /api/ai-task
```

## After running patch

1. Run `npm run build`.
2. Apply `supabase/migrations/20260509_phase1_tiered_api_admin_pipeline.sql`.
3. Add env vars in Vercel and local env.
4. Test parse endpoint with `dryRun: true`.
5. Then wire admin draft review UI.
