"use client"

import { useRef, type ReactNode } from "react"
import {
  getKeyboardModalShellStyle,
  type KeyboardModalViewportMode,
} from "./keyboard-modal-styles"
import { useKeyboardModal } from "./use-keyboard-modal"
import { useScrollFocusedInputIntoView } from "./use-scroll-focused-input-into-view"

type KeyboardModalShellProps = {
  isOpen: boolean
  children: ReactNode
  className?: string
  viewportMode?: KeyboardModalViewportMode
  scrollIntoView?: boolean
  "aria-label"?: string
  "aria-labelledby"?: string
}

export const KeyboardModalShell = ({
  isOpen,
  children,
  className = "",
  viewportMode = "fit",
  scrollIntoView = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: KeyboardModalShellProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useKeyboardModal(isOpen, { viewportMode })
  useScrollFocusedInputIntoView(modalRef, { enabled: isOpen && scrollIntoView })

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={modalRef}
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
