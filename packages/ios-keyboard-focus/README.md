# @nullcheck/ios-keyboard-focus

Reliable mobile keyboard focus for **iOS Safari** and **Android** when opening modals with inputs in React.

This package solves the problems you hit in real mobile web apps:

- Keyboard does not open when focusing an input from a button click
- Page content jumps when the keyboard appears
- iOS zooms in on inputs smaller than 16px
- "Add another" flows need to refocus and reopen the keyboard without closing the modal

Live demo: [ios-keyboard-focus.vercel.app](https://ios-keyboard-focus.vercel.app)

---

## Install

```bash
npm install @nullcheck/ios-keyboard-focus
```

**Peer dependencies:** `react` and `react-dom` (v18+)

### Use from this repo without publishing

```bash
# In your other project
npm install ../path/to/ios-keyboard-focus/packages/ios-keyboard-focus
```

Or link locally:

```bash
cd packages/ios-keyboard-focus
npm run build
npm link

cd your-other-project
npm link @nullcheck/ios-keyboard-focus
```

---

## Quick start (3 steps)

### 1. Add viewport + input CSS (Next.js example)

```tsx
// app/layout.tsx
export const viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "overlays-content",
}
```

```css
/* globals.css — prevents iOS auto-zoom */
@media (pointer: coarse) {
  input,
  textarea,
  select {
    font-size: 16px;
  }
}
```

### 2. Open modal and focus input in the same click handler

**Never use `useEffect` to autofocus on modal open — iOS will not open the keyboard.**

```tsx
"use client"

import { useRef, useState } from "react"
import { openModalWithInputFocus } from "@nullcheck/ios-keyboard-focus"

export const AddItemButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    openModalWithInputFocus(() => setIsOpen(true), nameInputRef, {
      selectOnFocus: true,
    })
  }

  return (
    <>
      <button type="button" onClick={handleOpen}>
        Add Item
      </button>
      {isOpen ? <YourModal nameInputRef={nameInputRef} /> : null}
    </>
  )
}
```

### 3. Wrap your modal with `KeyboardModalShell`

Choose a **viewport mode** based on your form layout:

| `viewportMode` | Footer when keyboard opens | Best for |
|----------------|----------------------------|----------|
| `"fit"` (default) | Stays visible above keyboard | Simple forms where actions must stay reachable |
| `"overlay"` | Stays at screen bottom, covered by keyboard | Forms with custom dropdowns/selectors near inputs |

Use `"overlay"` when a fixed footer jumping above the keyboard blocks popovers or custom pickers. Footer actions may require dismissing the keyboard first.

```tsx
import { KeyboardModalShell } from "@nullcheck/ios-keyboard-focus"

export const YourModal = ({ nameInputRef, isOpen, onClose }) => (
  <KeyboardModalShell
    isOpen={isOpen}
    viewportMode="overlay"
    aria-labelledby="modal-title"
    className="z-50 flex flex-col bg-white"
  >
    <header>...</header>
    <div className="flex-1 overflow-y-auto overscroll-contain">
      <input ref={nameInputRef} type="text" className="text-base" />
    </div>
    <footer>...</footer>
  </KeyboardModalShell>
)
```

That is the minimum setup for stable layout + keyboard open on iOS.

---

## Scroll focused inputs into view

By default, focused inputs scroll into the visible area above the keyboard. This works inside modals (`KeyboardModalShell` enables it automatically) and on regular pages (attach the hook to your scroll container).

### Modal (automatic)

`KeyboardModalShell` listens for focus inside the modal and scrolls inputs into view when the keyboard opens. Disable globally with:

```tsx
<KeyboardModalShell isOpen={isOpen} scrollIntoView={false}>
  ...
</KeyboardModalShell>
```

### Regular pages

Attach the hook to any scrollable container:

```tsx
"use client"

import { useRef } from "react"
import { useScrollFocusedInputIntoView } from "@nullcheck/ios-keyboard-focus"

export const LongForm = () => {
  const formRef = useRef<HTMLFormElement>(null)

  useScrollFocusedInputIntoView(formRef)

  return (
    <form ref={formRef} className="overflow-y-auto">
      <input type="text" />
      {/* more fields */}
    </form>
  )
}
```

### Opt out for top inputs

Skip scroll-into-view for inputs already visible at the top (e.g. the first field when opening a modal):

**HTML attribute (recommended for user taps):**

```tsx
<input
  data-keyboard-scroll-into-view="false"
  type="text"
/>
```

**Programmatic focus option:**

```tsx
openModalWithInputFocus(() => setIsOpen(true), nameInputRef, {
  scrollIntoView: false,
})

refocusInputInModal(nameInputRef, { scrollIntoView: false })
```

Inputs that are already fully visible in the visual viewport are skipped automatically — you only need to opt out when you want to prevent scrolling even if the field would otherwise be adjusted.

### Manual scroll

```tsx
import { scrollFocusedInputIntoView } from "@nullcheck/ios-keyboard-focus"

inputRef.current?.focus({ preventScroll: true })
scrollFocusedInputIntoView(inputRef.current)
```

---

## How it works

```text
User taps button
  → flushSync opens modal (input exists in DOM)
  → focusInput() runs in same click handler
  → if iOS blocks keyboard, focusWithIosKeyboard() uses anchor-input trick
  → KeyboardModalShell applies viewport mode (fit or overlay)
  → scroll lock stops Safari from panning the page
  → focused inputs scroll into the visible area above the keyboard (by default)
```

### Viewport modes

**`fit` (default)** — Tracks `visualViewport` size and offset so the modal shrinks with the keyboard. The footer stays visible above the keyboard. Good for simple forms.

**`overlay`** — Keeps the modal at full layout height (`100dvh`). The keyboard overlays the bottom of the modal; the footer does not move. Good for forms with custom dropdowns that need space below inputs. Pair with `interactiveWidget: "overlays-content"` in your viewport meta.

### Why iOS is different

Safari only opens the virtual keyboard when `focus()` runs **inside the original tap/click handler**. Deferred focus (`setTimeout`, `useEffect`, `await`) often focuses the input without showing the keyboard.

When the keyboard opens, iOS shrinks the **visual viewport** and may pan the page. A modal using only `position: fixed; top: 0; height: 100vh` can jump. In `fit` mode, this package tracks `visualViewport.offsetTop` and `visualViewport.height` to keep the modal pinned to the visible screen area. In `overlay` mode, the modal stays on the layout viewport and the keyboard covers the bottom.

---

## API reference

### Functions

| Export | Purpose |
|--------|---------|
| `openModalWithInputFocus(open, ref, options?)` | Open modal + focus input synchronously |
| `refocusInputInModal(ref, options?)` | Refocus after form clear (use in button handler) |
| `focusInput(ref, options?)` | Focus with `preventScroll`; returns success boolean |
| `focusWithIosKeyboard(ref, options?)` | Anchor-input fallback for stubborn iOS cases |
| `scrollFocusedInputIntoView(element, options?)` | Scroll a focused input above the keyboard |
| `scheduleScrollFocusedInputIntoView(element, options?)` | Scroll after keyboard/viewport updates |
| `shouldScrollFocusedInputIntoView(element)` | Returns false when opt-out attribute is set |
| `getKeyboardOverlap()` | Returns keyboard overlap height in pixels |
| `getKeyboardModalShellStyle({ viewportMode? })` | Inline styles for custom modal markup |
| `keyboardModalShellStyle` | Fit-mode style object (visual viewport) |
| `keyboardModalShellOverlayStyle` | Overlay-mode style object (layout viewport) |

### Hooks

| Export | Purpose |
|--------|---------|
| `useKeyboardModal(isOpen, { viewportMode? })` | Viewport tracking (fit only), scroll lock, body overflow hidden |
| `useScrollFocusedInputIntoView(containerRef, { enabled?, padding?, force? })` | Scroll focused inputs inside a container |
| `useVisualViewport({ enabled? })` | Tracks viewport metrics + sets CSS variables on `<html>` |
| `useVisualViewportScrollLock(enabled)` | Prevents Safari page pan when keyboard opens |
| `useVisualViewportHeight()` | Returns viewport height only |
| `useIosInputFocus({ inputRef, enabled })` | Returns `refocus` and `refocusWithFallback` helpers |

### Components

| Export | Purpose |
|--------|---------|
| `KeyboardModalShell` | Modal container with `viewportMode`: `"fit"` or `"overlay"`; `scrollIntoView` defaults to `true` |

### CSS variables (set automatically in `fit` mode)

| Variable | Meaning |
|----------|---------|
| `--visual-viewport-height` | Visible area height |
| `--visual-viewport-width` | Visible area width |
| `--visual-viewport-offset-top` | Top offset when iOS pans |
| `--visual-viewport-offset-left` | Left offset |

### Types

| Export | Meaning |
|--------|---------|
| `KeyboardModalViewportMode` | `"fit"` \| `"overlay"` |
| `ScrollFocusedInputIntoViewOptions` | `{ padding?: number; force?: boolean }` |
| `KEYBOARD_SCROLL_INTO_VIEW_ATTR` | `"data-keyboard-scroll-into-view"` — set to `"false"` to opt out |

---

## Full example: form with "Add" and "Add Another"

```tsx
"use client"

import { useRef, useState } from "react"
import { flushSync } from "react-dom"
import {
  KeyboardModalShell,
  openModalWithInputFocus,
  refocusInputInModal,
} from "@nullcheck/ios-keyboard-focus"

export const ItemForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => {
    openModalWithInputFocus(() => setIsOpen(true), nameInputRef)
  }

  const handleAddAnother = () => {
    // save item...

    flushSync(() => setName(""))
    refocusInputInModal(nameInputRef, { selectOnFocus: true })
  }

  const handleAdd = () => {
    // save item...
    nameInputRef.current?.blur()
    setIsOpen(false)
  }

  return (
    <>
      <button type="button" onClick={handleOpen}>Add Item</button>

      <KeyboardModalShell
        isOpen={isOpen}
        viewportMode="overlay"
        aria-labelledby="add-item-title"
        className="z-50 flex flex-col bg-white"
      >
        <h2 id="add-item-title">Add Item</h2>

        <input
          ref={nameInputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          inputMode="text"
          className="text-base"
        />

        <button type="button" onClick={handleAddAnother}>Add Another</button>
        <button type="button" onClick={handleAdd}>Add</button>
      </KeyboardModalShell>
    </>
  )
}
```

---

## Input keyboard types

| Field type | `type` | `inputMode` | Notes |
|------------|--------|-------------|-------|
| Text | `text` | `text` | Default keyboard |
| Email | `email` | `email` | Email keyboard |
| Numbers | `text` | `numeric` | Add `pattern="[0-9]*"` for legacy iOS numeric pad |
| Decimals | `text` | `decimal` | Shows decimal key |

Avoid `type="number"` for phone codes, quantities, or OTP — it adds spinners and behaves poorly on mobile.

Always use **16px+ font size** on inputs (`text-base` in Tailwind) to prevent iOS zoom.

---

## Next.js setup

Add the package to `transpilePackages` if you install from source/workspace:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["@nullcheck/ios-keyboard-focus"],
}

export default nextConfig
```

---

## Publishing to npm

```bash
cd packages/ios-keyboard-focus
npm run build
npm publish --access public
```

Scoped package name: `@nullcheck/ios-keyboard-focus`

---

## Known iOS limitations

- The keyboard **overlays** content; it does not always resize the layout viewport
- Scroll-into-view uses the visual viewport and inner scroll containers; very bottom fields may need enough scroll room in the container
- `focus()` after `await` breaks the user-gesture chain — refocus in the same click handler
- Do not use `maximum-scale=1` or `user-scalable=no` — accessibility violation
- Do not use `position: fixed` on `body` — can freeze modals when keyboard toggles

---

## License

MIT
