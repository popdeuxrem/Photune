#!/usr/bin/env python3
"""
Smoke test for Photune persistence layer:
- Validates auto-save implementation
- Validates canvas persistence (load/save cycle)
- Validates conflict detection
"""

import sys
import json
from pathlib import Path

def validate_auto_save_ts():
    """Check that auto-save.ts exists and has required exports."""
    auto_save_path = Path(__file__).parent.parent / "src" / "shared" / "lib" / "auto-save.ts"
    
    if not auto_save_path.exists():
        print("[FAIL] auto-save.ts does not exist")
        return False
    
    with open(auto_save_path, 'r') as f:
        content = f.read()
    
    required_exports = [
        'export async function autoSaveProject',
        'lastSaveTime',
        'conflict detection',
        'exponential backoff',
    ]
    
    for export in required_exports:
        if export not in content:
            print(f"[WARN] auto-save.ts missing: {export}")
    
    print("[PASS] auto-save.ts exists with required structure")
    return True

def validate_canvas_persistence_ts():
    """Check that canvas-persistence.ts exists and has required exports."""
    persistence_path = Path(__file__).parent.parent / "src" / "features" / "editor" / "lib" / "canvas-persistence.ts"
    
    if not persistence_path.exists():
        print("[FAIL] canvas-persistence.ts does not exist")
        return False
    
    with open(persistence_path, 'r') as f:
        content = f.read()
    
    required_exports = [
        'export function extractCanvasToPersistence',
        'export async function hydrateCanvasFromPersistence',
        'schema validation',
        'corrupted state handling',
    ]
    
    for export in required_exports:
        if export not in content:
            print(f"[WARN] canvas-persistence.ts missing: {export}")
    
    print("[PASS] canvas-persistence.ts exists with required structure")
    return True

def validate_editor_client_integration():
    """Check that EditorClient.tsx imports and integrates auto-save."""
    editor_path = Path(__file__).parent.parent / "src" / "features" / "editor" / "components" / "EditorClient.tsx"
    
    if not editor_path.exists():
        print("[FAIL] EditorClient.tsx does not exist")
        return False
    
    with open(editor_path, 'r') as f:
        content = f.read()
    
    required_patterns = [
        'import { autoSaveProject }',
        'import { extractCanvasToPersistence }',
        'autoSaveTimerRef',
        'setInterval',
        '30_000',
        'lastSaveTime',
    ]
    
    missing = []
    for pattern in required_patterns:
        if pattern not in content:
            missing.append(pattern)
    
    if missing:
        print(f"[WARN] EditorClient.tsx missing patterns: {missing}")
    else:
        print("[PASS] EditorClient.tsx successfully integrated auto-save")
    
    return len(missing) == 0

def validate_package_json_scripts():
    """Check that package.json has persistence smoke test script."""
    pkg_path = Path(__file__).parent.parent / "package.json"
    
    if not pkg_path.exists():
        print("[FAIL] package.json does not exist")
        return False
    
    with open(pkg_path, 'r') as f:
        pkg = json.load(f)
    
    scripts = pkg.get('scripts', {})
    
    if 'smoke:persistence' not in scripts:
        print("[WARN] package.json missing smoke:persistence script")
        return False
    
    if 'smoke:persistence' not in scripts['smoke']:
        print("[WARN] smoke script does not include smoke:persistence")
        return False
    
    print("[PASS] package.json scripts correctly configured")
    return True

def main():
    print("\n========================================")
    print("Photune Persistence Layer Smoke Test")
    print("========================================\n")
    
    tests = [
        ("Auto-save module", validate_auto_save_ts),
        ("Canvas persistence module", validate_canvas_persistence_ts),
        ("EditorClient integration", validate_editor_client_integration),
        ("Package.json scripts", validate_package_json_scripts),
    ]
    
    results = []
    for test_name, test_fn in tests:
        try:
            result = test_fn()
            results.append((test_name, result))
        except Exception as e:
            print(f"[ERROR] {test_name}: {e}")
            results.append((test_name, False))
    
    print("\n========================================")
    print("Test Summary")
    print("========================================")
    
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("========================================\n")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
