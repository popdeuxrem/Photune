# Photune Implementation Quick Reference

## What Was Done (PHASE 0 + 1 + 2)

### ✅ PHASE 1: Auto-Save + Canvas Persistence
- **Auto-save timer** every 30 seconds (configurable)
- **Collision detection** prevents silent overwrites from concurrent edits
- **Canvas JSON persistence** with schema validation
- **Exponential backoff retry** on transient failures

### ✅ PHASE 2: UX + Safety
- **Layer locking visual feedback** (dimmed + icon + label)
- **Mobile panel responsiveness** (scrollable, 40vh max)
- **AI cache salting** prevents key collisions across models
- **Environment validation** with helpful setup docs

---

## New Modules & APIs

### 1. Auto-Save (`src/shared/lib/auto-save.ts`)
```typescript
import { autoSaveProject } from '@/shared/lib/auto-save';

// Server-side action
const result = await autoSaveProject(
  projectId,
  canvasJson,
  imageUrl,
  lastKnownUpdateTime,
);

// Returns: { success, saved, message?, retryAfterMs? }
if (result.success && result.saved) {
  console.log('Project auto-saved');
} else if (result.message?.includes('Conflict')) {
  console.log('Another client modified this project');
}
```

### 2. Canvas Persistence (`src/features/editor/lib/canvas-persistence.ts`)
```typescript
import {
  hydrateCanvasFromPersistence,
  extractCanvasToPersistence,
} from '@/features/editor/lib/canvas-persistence';

// Extract for saving
const { canvasJson, imageUrl } = extractCanvasToPersistence(canvas, imageUrl);

// Hydrate from storage
const result = await hydrateCanvasFromPersistence(canvas, canvasJson, imageUrl);
if (result.success) {
  console.log('Canvas restored:', result.image);
}
```

### 3. AI Cache with Salting (`src/shared/lib/ai/ai-cache.ts`)
```typescript
import { AICacheService } from '@/shared/lib/ai/ai-cache';

// Save with model version salt
await AICacheService.set('fix spelling', 'result1', 3600000, {
  model: 'groq/mixtral',
  version: '2.0',
});

// Retrieve with same salt
const cached = await AICacheService.get('fix spelling', {
  model: 'groq/mixtral',
  version: '2.0',
});
```

### 4. Environment Validation (`src/shared/lib/env-validation.ts`)
```typescript
import { validateEnvironment, getEnvDocumentation } from '@/shared/lib/env-validation';

// Validate all required env vars (throws if missing)
validateEnvironment();

// Get markdown setup guide
const docs = getEnvDocumentation();
console.log(docs);
```

---

## File Changes Summary

### New Files
| File | Lines | Purpose |
|------|-------|---------|
| `src/shared/lib/auto-save.ts` | 138 | Server-side auto-save with collision detection |
| `src/features/editor/lib/canvas-persistence.ts` | 173 | Canvas hydration + serialization |
| `src/shared/lib/env-validation.ts` | 153 | Env var docs + validation |

### Modified Files
| File | Change | Impact |
|------|--------|--------|
| `src/features/editor/components/EditorClient.tsx` | +50 lines | Auto-save effect integration |
| `src/features/editor/components/Panels/LayersModePanel.tsx` | +16 lines | Lock visual feedback |
| `src/features/editor/components/EditorShell.tsx` | +8 lines | Mobile panel responsiveness |
| `src/shared/lib/ai/ai-cache.ts` | +42 lines | Salted cache keys + TTL |

---

## Key Features Explained

### Auto-Save (PHASE 1)
**Why:** Prevents data loss on network failures, page crashes.

**How it works:**
1. Every 30 seconds, canvas state is captured
2. Sent to server with timestamp of last known update
3. Server checks if another client modified the project
4. If conflict detected → user gets toast notification
5. If no conflict → canvas saved to database

**User sees:**
- Console logs showing save progress (dev mode)
- Toast notification if conflict detected
- No disruption to editing flow

### Layer Locking UI (PHASE 2)
**Why:** Visual feedback for protected layers reduces confusion.

**Changes:**
- Locked layer cards appear **dimmed** (opacity: 0.75)
- Locked layer has **lock icon** overlay on role badge
- Locked layer name shows **(locked)** suffix
- Cannot click to select a locked layer

**Before vs After:**
```
Before:                    After:
[Background] ← unclear     [Background] (locked) ← clear!
                          (dimmed appearance, lock icon)
```

### Cache Salting (PHASE 2)
**Why:** Different AI models shouldn't share cache keys.

**How it works:**
```
Before:  cache["fix spelling"] = "result from model A"
         cache["fix spelling"] = "result from model B"  ← overwrites!

After:   cache["sk_hash_groq_1.0"] = "result from model A"
         cache["sk_hash_groq_2.0"] = "result from model B"  ← no collision!
```

### Mobile Responsiveness (PHASE 2)
**Why:** Controls shouldn't get cut off on small screens.

**Changes:**
- Bottom panel max-height: 40vh (scrollable if needed)
- Mode nav positioned above panel
- Canvas takes 60% of screen (still usable for editing)
- Proper padding for touch targets

---

## Testing Checklist

### Auto-Save
- [ ] Add shapes to canvas
- [ ] Wait 30 seconds
- [ ] Check console for `[autosave] project saved successfully`
- [ ] Reload page → shapes should still be there

### Conflict Detection
- [ ] Open same project in 2 browser tabs
- [ ] Edit in tab A, wait 30s (auto-save)
- [ ] Switch to tab B, make edits, wait 30s
- [ ] Should see toast: "Sync conflict detected"

### Layer Locking
- [ ] Select any layer
- [ ] Click lock button
- [ ] Verify layer appears dimmed + "(locked)" label
- [ ] Try clicking locked layer → shouldn't select

### Mobile Responsiveness
- [ ] Open editor on mobile (<1024px)
- [ ] Bottom panel should appear with controls
- [ ] Scroll panel if content exceeds 40vh
- [ ] Canvas should still be 60%+ visible

### Environment Validation
- [ ] Remove `GROQ_API_KEY` from `.env.local`
- [ ] Run `npm run dev`
- [ ] Should see error: "Missing required environment variables: GROQ_API_KEY"

---

## Environment Variables Required

### Critical (Auto-Stop if Missing)
- `GROQ_API_KEY` - Groq API key for text rewriting
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Optional (Nice to Have)
- `CLOUDFLARE_API_TOKEN` - For image inpainting
- `STRIPE_SECRET_KEY` - For premium features

**Setup:**
```bash
# Get GROQ_API_KEY from https://console.groq.com/keys
# Get Supabase keys from https://supabase.com/dashboard

# Add to .env.local:
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Debugging Guide

### Auto-Save Issues
```javascript
// Check browser console
// Look for: "[autosave] project saved successfully"

// If no logs after 30s:
// 1. Open DevTools → Network tab
// 2. Perform edit, wait 30s
// 3. Look for POST request to /api/auto-save
// 4. Check response status + error

// If "Conflict detected":
// 1. Conflict is intentional (another client edited project)
// 2. Options:
//    - Reload page to sync with server
//    - Continue editing (will overwrite other client's changes)
```

### Layer Lock Not Visual
```javascript
// Verify layer.locked property is true:
useLayerStack().layers.map(l => ({ name: l.label, locked: l.locked }))

// Should show: { name: "Background", locked: true }
// If not, toggleLock() might not be working
```

### Mobile Panel Cut Off
```html
<!-- Check EditorShell.tsx has: -->
<section className="max-h-[40vh] min-h-0 shrink-0 overflow-y-auto">
  {mobilePanel}
</section>

<!-- If missing, panel will stretch beyond available space -->
```

---

## Common Questions

### Q: How often does auto-save run?
**A:** Every 30 seconds. Configurable in EditorClient.tsx (change `30_000` to different ms value).

### Q: What if user has unstable internet?
**A:** Auto-save uses exponential backoff: 1s → 2s → 4s → 8s retry delays. Console logs each attempt.

### Q: Can I disable auto-save?
**A:** Yes, comment out the auto-save effect in EditorClient.tsx. Or set interval to very large number (e.g., `999_999_999`).

### Q: Does layer locking prevent programmatic access?
**A:** No, visual UI only. Canvas API can still modify locked layers. Add backend validation if needed.

### Q: Why 40vh for mobile panel?
**A:** Leaves 60% for canvas editing on small screens. Adjust to 50vh or 30vh if needed.

### Q: What models are supported in cache salting?
**A:** Any string value. Pass `{ model: "your-model-name", version: "1.0" }` when saving/loading.

---

## Rollback Instructions

If issues arise, rollback is straightforward:

### Remove Auto-Save
```bash
# 1. Delete src/shared/lib/auto-save.ts
# 2. Delete src/features/editor/lib/canvas-persistence.ts
# 3. Revert changes in EditorClient.tsx (git revert)
# Auto-save won't run, but app still functional
```

### Remove Layer Locking UI
```bash
# 1. Revert LayersModePanel.tsx (git revert)
# Lock buttons still work, just no visual feedback
```

### Disable Cache Salting
```typescript
// In any file using AICacheService:
// Remove options parameter:
await AICacheService.get(key); // ← instead of { model, version }
// Back to simple cache, but no collision prevention
```

---

## Next Steps (PHASE 3)

1. **Canvas Hydration** - Load persisted canvas on page open
2. **Text Editing UX** - Fix focus/blur race conditions
3. **Export Rollback** - Transactional exports with error recovery
4. **Conflict UI** - Show modal when conflict detected
5. **Setup CLI** - Interactive env var setup tool

See `IMPLEMENTATION-SUMMARY.md` for detailed roadmap.

---

## Support & Questions

- **Technical Details:** See `PHASE-1-IMPLEMENTATION.md` and `PHASE-2-IMPLEMENTATION.md`
- **Architecture:** See data flow diagrams in `IMPLEMENTATION-SUMMARY.md`
- **Issues:** Check console logs ([autosave], [canvas_restore], etc.)
- **Environment Setup:** Run `validateEnvironment()` for helpful errors

---

**Last Updated:** 2026-04-08
**Status:** PHASE 0 + 1 + 2 Complete ✅
**Next:** PHASE 3 Awaiting Start
