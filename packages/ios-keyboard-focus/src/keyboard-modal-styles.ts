import type { CSSProperties } from "react"

export const keyboardModalShellStyle: CSSProperties = {
  position: "fixed",
  top: "var(--visual-viewport-offset-top, 0px)",
  left: "var(--visual-viewport-offset-left, 0px)",
  width: "var(--visual-viewport-width, 100%)",
  height: "var(--visual-viewport-height, 100dvh)",
}

export const getKeyboardModalShellStyle = (): CSSProperties => ({
  ...keyboardModalShellStyle,
})
