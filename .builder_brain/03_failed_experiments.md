# 03 Failed Experiments & Pitfalls

This document tracks approaches that seemed like a good idea but failed in practice. If you are considering one of these solutions, stop and reconsider.

## 1. Native `autoPlay` on React `<audio>` elements
- **The Idea:** Putting `autoPlay` directly on the `<audio>` element to instantly play local `blob:` URLs when they load.
- **The Failure:** If the user rapidly clicks "clear track" or swaps tracks, React unmounts or changes the `<audio>` element while the browser is still processing the implicit playback promise. This triggers a `DOMException: The play() request was interrupted`, which bubbles up as an unhandled `AbortError` and completely crashes the app.
- **The Fix:** Remove `autoPlay`. Manage playback in a `useEffect` that manually calls `audioRef.current.play()`. Capture the returned promise and explicitly `.catch()` and suppress `AbortError`s.

## 2. Unmounting the Media Player when Minimized
- **The Idea:** Using conditional rendering (`{isPlayerMinimized ? null : <Player />}`) to hide the audio player and save DOM space.
- **The Failure:** Unmounting the component completely stops the music playback, destroying the user experience.
- **The Fix:** Hide the player using CSS classes instead (e.g., `className={isPlayerMinimized ? 'h-0 opacity-0 overflow-hidden' : ''}`) so it stays in the DOM and continues playing.

## 3. Instant Timeline Dragging on PointerDown
- **The Idea:** Allowing subtitle blocks to be instantly draggable horizontally the moment the user clicks and drags them.
- **The Failure:** Users frequently double-click blocks to edit text or single-click to select them. Instant dragging causes accidental, destructive timeline shifts during these normal interactions.
- **The Fix:** Require an explicit "Move Block" mode (a toggle button on the selected block's floating action bar). The block only becomes draggable when this mode is active.

## 4. Live AI Translation Sync on Keystroke
- **The Idea:** Automatically triggering Gemini to sync/translate the bottom lines of a bilingual subtitle block every time the user types a character in the top line.
- **The Failure:** Instant rate-limiting, massive API cost bloat, race conditions with returning API calls overwriting active typing, and extreme UI lag.
- **The Fix:** Added a manual "Sync Trans" button that users press *after* they finish editing the line to trigger a single, clean translation sync.
