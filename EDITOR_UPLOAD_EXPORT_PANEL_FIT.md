# EDITOR_UPLOAD_EXPORT_PANEL_FIT

## Purpose
Define the concrete shell-fit rules for Upload and Export mode panels.

## Upload Mode Panel Fit

### Ownership
- shell owns trigger and file input
- panel triggers shell-owned upload action

### UI Rule
- panel is instructional + action-oriented
- one clear upload CTA
- no duplicate hidden file inputs inside multiple nested components

### Mobile
- shown inside mobile tool sheet

### Desktop
- shown inside contextual panel

---

## Export Mode Panel Fit

### Ownership
- shell owns export trigger intent
- panel exposes detailed export actions/options

### UI Rule
- top bar remains a shortcut into export flow
- panel is the detailed export workspace

### Mobile
- shown inside mobile tool sheet

### Desktop
- shown inside contextual panel

---

## Success Criteria
- Upload mode is coherent in both empty and non-empty project states
- Export mode is coherent in both top-bar and panel access paths
- one active panel model is preserved
- no duplicated ownership is introduced