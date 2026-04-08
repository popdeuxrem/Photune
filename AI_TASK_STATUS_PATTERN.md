# AI_TASK_STATUS_PATTERN

## Goal
Standardize how AI-backed UI surfaces represent task state.

## Canonical phases
- idle
- loading
- success
- fallback
- error

## Usage pattern
1. create hook instance with `useAITask<T>()`
2. call `run(() => someAIClientTask(), { isFallback })`
3. render UI from `state.phase`

## Fallback meaning
`fallback` means:
- task technically returned
- result is the safe fallback value
- UI should remain usable
- user may optionally be informed that fallback content was used

## Error meaning
`error` means:
- task failed hard
- UI should show a clear recoverable error state

## Rule
Do not infer fallback from exceptions.
Fallback is only when a task resolves to a known safe fallback result.

