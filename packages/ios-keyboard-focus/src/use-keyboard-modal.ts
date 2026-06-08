"use client"

import { useEffect } from "react"
import { useVisualViewport } from "./use-visual-viewport"
import { useVisualViewportScrollLock } from "./use-visual-viewport-scroll-lock"

export const useKeyboardModal = (isOpen: boolean) => {
  const metrics = useVisualViewport()

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
