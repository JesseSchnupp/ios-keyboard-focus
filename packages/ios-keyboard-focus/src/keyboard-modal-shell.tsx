"use client"

import type { ReactNode } from "react"
import {
  getKeyboardModalShellStyle,
  type KeyboardModalViewportMode,
} from "./keyboard-modal-styles"
import { useKeyboardModal } from "./use-keyboard-modal"

type KeyboardModalShellProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
  viewportMode?: KeyboardModalViewportMode
  "aria-label"?: string
  "aria-labelledby"?: string
}

export const KeyboardModalShell = ({
  isOpen,
  children,
  className = "",
  viewportMode = "fit",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: KeyboardModalShellProps) => {
  useKeyboardModal(isOpen, { viewportMode })

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={`touch-manipulation overscroll-contain ${className}`.trim()}
      style={getKeyboardModalShellStyle({ viewportMode })}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </div>
  )
}
