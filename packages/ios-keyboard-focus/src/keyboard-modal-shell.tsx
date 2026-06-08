"use client"

import type { ReactNode } from "react"
import { keyboardModalShellStyle } from "./keyboard-modal-styles"
import { useKeyboardModal } from "./use-keyboard-modal"

type KeyboardModalShellProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

export const KeyboardModalShell = ({
  isOpen,
  children,
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: KeyboardModalShellProps) => {
  useKeyboardModal(isOpen)

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={`touch-manipulation overscroll-contain ${className}`.trim()}
      style={keyboardModalShellStyle}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </div>
  )
}
