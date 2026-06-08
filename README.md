# iOS Keyboard Focus

Demo app and npm package for reliable mobile keyboard focus on iOS Safari and Android.

**Live demo:** [ios-keyboard-focus.vercel.app](https://ios-keyboard-focus.vercel.app)

## Package

The reusable library lives at [`packages/ios-keyboard-focus`](packages/ios-keyboard-focus).

```bash
npm install @jesse-schnupp/ios-keyboard-focus
```

**Documentation:** [packages/ios-keyboard-focus/README.md](packages/ios-keyboard-focus/README.md)

## Quick usage

```tsx
import { useRef, useState } from "react"
import {
  KeyboardModalShell,
  openModalWithInputFocus,
} from "@jesse-schnupp/ios-keyboard-focus"

const nameInputRef = useRef<HTMLInputElement>(null)
const [isOpen, setIsOpen] = useState(false)

const handleOpen = () => {
  openModalWithInputFocus(() => setIsOpen(true), nameInputRef)
}

return (
  <>
    <button type="button" onClick={handleOpen}>Add Item</button>
    <KeyboardModalShell isOpen={isOpen} className="z-50 flex flex-col bg-white">
      <input ref={nameInputRef} type="text" className="text-base" />
    </KeyboardModalShell>
  </>
)
```

## Development

```bash
npm install
npm run dev
```

Build demo + package:

```bash
npm run build
```

## Project structure

```text
packages/ios-keyboard-focus/   # Publishable npm package
src/
  app/                         # Next.js demo
  components/                  # Demo UI
  lib/ios-keyboard-focus/      # Re-exports package for demo aliases
```

## License

MIT
