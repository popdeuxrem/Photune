# EDITOR_UPLOAD_EXPORT_VALIDATION

## Upload Validation

### New Project
- [ ] `/editor/new` shows upload-first empty state
- [ ] upload CTA opens file picker
- [ ] PNG upload succeeds
- [ ] JPEG upload succeeds
- [ ] WebP upload succeeds
- [ ] unsupported type is rejected early
- [ ] oversized file is rejected early

### Existing Project
- [ ] Upload mode is reachable from mode nav
- [ ] Upload mode opens in mobile sheet on mobile
- [ ] Upload mode opens in panel on desktop
- [ ] upload uses the same canonical validation path

---

## Export Validation

### Access
- [ ] export remains reachable from top bar
- [ ] Export mode is reachable from mode nav
- [ ] Export mode opens correctly in mobile sheet
- [ ] Export mode opens correctly in desktop panel

### Behavior
- [ ] export options are visible and understandable
- [ ] export action still works
- [ ] no duplicate/conflicting export controls confuse the user

---

## Regression Validation
- [ ] `/editor/new` still loads
- [ ] existing `/editor/[projectId]` still loads
- [ ] save/load behavior is unchanged
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run smoke`
- [ ] `npm run check`