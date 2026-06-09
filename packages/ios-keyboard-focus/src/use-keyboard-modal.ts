"use client"

import { useEffect } from "react"
import type { KeyboardModalViewportMode } from "./keyboard-modal-styles"
import { useVisualViewport } from "./use-visual-viewport"
import { useVisualViewportScrollLock } from "./use-visual-viewport-scroll-lock"

type UseKeyboardModalOptions = {
  viewportMode?: KeyboardModalViewportMode
}

export const useKeyboardModal = (
  isOpen: boolean,
  options: UseKeyboardModalOptions = {}
) => {
  const { viewportMode = "fit" } = options
  const metrics = useVisualViewport({ enabled: viewportMode === "fit" })

  useVisualViewportScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return { metrics }
}
