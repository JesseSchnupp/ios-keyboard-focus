import type { CSSProperties } from "react"

export type KeyboardModalViewportMode = "fit" | "overlay"

export const keyboardModalShellStyle: CSSProperties = {
  position: "fixed",
  top: "var(--visual-viewport-offset-top, 0px)",
  left: "var(--visual-viewport-offset-left, 0px)",
  width: "var(--visual-viewport-width, 100%)",
  height: "var(--visual-viewport-height, 100dvh)",
}

export const keyboardModalShellOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100dvh",
}

type GetKeyboardModalShellStyleOptions = {
  viewportMode?: KeyboardModalViewportMode
}

export const getKeyboardModalShellStyle = (
  options: GetKeyboardModalShellStyleOptions = {}
): CSSProperties => {
  const { viewportMode = "fit" } = options

  if (viewportMode === "overlay") {
    return { ...keyboardModalShellOverlayStyle }
  }

  return { ...keyboardModalShellStyle }
}
