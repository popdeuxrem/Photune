# M4 — AI Containment and Provider Boundary Hardening

## Objective

Constrain AI features so they remain optional, bounded, and operationally safe.

## Scope

This slice covers:

- provider boundary normalization
- request/response validation
- failure containment
- user-confirmed application of AI output
- active/deferred provider discipline

This slice does NOT cover:

- new AI product features
- new providers
- autonomous background mutation of project state
- billing changes unrelated to provider access control

## Required Outcomes

1. AI routes fail safely without breaking the editor.
2. AI responses are validated before client application.
3. AI output cannot silently mutate persisted project state.
4. Deferred providers remain outside live paths.
5. Provider-specific assumptions are isolated behind explicit boundaries.

## Validation Gates

- npm run lint
- npm run typecheck
- npm run build
- npm run smoke

## Risks

- provider drift
- malformed AI output entering editor state
- hidden dependency on AI availability
- undocumented active provider expansion

## Rollback Rule

If AI containment weakens editor determinism or provider-policy smoke fails, revert the entire M4 patch set.

