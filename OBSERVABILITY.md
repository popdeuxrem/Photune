# OBSERVABILITY

## Purpose
This document defines the current observability posture for Photune and the minimum next instrumentation standard.

## Current State
Photune currently has a validated build/test path, but observability is still lightweight.

Observed reality:
- logs exist in some handlers/components
- there is no documented structured logging standard
- there is no explicit tracing/metrics baseline
- there is no defined alerting policy in repo artifacts yet

## Goals
Observability must support:
1. deploy verification
2. incident diagnosis
3. auth/persistence debugging
4. billing/provider failure diagnosis
5. rollback confidence

## Minimum Signals to Preserve

### Build / CI Signals
Must always be observable:
- lint result
- typecheck result
- build result
- smoke result

### Runtime Signals
Should be observable:
- route failures
- auth callback failures
- dashboard project load failures
- editor save/load failures
- checkout/webhook failures
- AI route/provider failures

## Logging Standard
Preferred direction:
- structured logs over ad hoc strings
- include route/action name
- include provider name when provider-related
- include stable identifiers where safe (project id, user id if appropriate and safe)
- avoid logging secrets or sensitive payload contents

## Log Categories

### Application
Examples:
- route execution
- key state transitions
- recoverable errors
- provider call failures

### Provider
Examples:
- Stripe checkout creation failure
- webhook verification failure
- Mailgun send failure
- Groq/Cloudflare API failure

### Persistence
Examples:
- failed `projects` query
- failed save/update
- subscription state write failure

## High-Value Future Instrumentation
1. route-level structured logging
2. request correlation identifiers
3. auth callback success/failure counters
4. editor save/load event logs
5. billing webhook success/failure logs
6. AI provider latency/error tracking

## Minimum Incident Queries
During an incident, operators should be able to answer:
- what route failed?
- did build validation pass before deploy?
- is failure code, config, schema, or provider related?
- are multiple users affected or one?
- did project access or persistence fail?
- did webhook/provider integration fail?

## Practical Near-Term Backlog
1. standardize server log shape
2. add explicit logs around:
   - auth callback
   - dashboard project load
   - editor save/load
   - Stripe checkout/webhook
3. document where to inspect logs in Vercel/Supabase/provider dashboards
4. add error-boundary strategy for critical UI surfaces

## Verification During Deploy
After deploy, observe:
- homepage request success
- login route success
- dashboard load success
- editor route success
- one save/load project cycle
- one upgrade flow entrypoint load

If any of these fail, treat deployment as suspect even if build passed.

