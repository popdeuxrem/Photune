# AI_CLIENT_ARCHITECTURE

## Goal
Provide a repo-compatible AI client for Photune that is:
- typed
- fault-tolerant
- browser-safe
- key-safe via serverless proxies
- locally cacheable for repeat string tasks

## Current endpoints
- `/api/ai/groq`
- `/api/ai/workers`

## Current supported client tasks
- rewrite
- detectFont
- generateProjectTitle
- generateBackground

## Cache policy
### Cached
- rewrite: 7 days
- detectFont: 24 hours
- generateProjectTitle: 24 hours

### Not cached
- generateBackground Blob responses

## Why background generation is not cached yet
Blob caching introduces:
- storage pressure
- quota risk
- object URL lifecycle issues
- more complex invalidation

## Failure model
- string tasks return fallback values
- background generation throws on failure
- upstream failures are logged client-side

## Deferred work
- shared invalidation policy
- metrics hooks
- offline queueing
- IndexedDB size accounting
- cache hit telemetry