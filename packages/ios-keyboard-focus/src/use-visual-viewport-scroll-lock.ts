"use client"

import { useEffect } from "react"

export const useVisualViewportScrollLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const visualViewport = window.visualViewport

    const lockWindowScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0)
      }
    }

    lockWindowScroll()
    visualViewport?.addEventListener("scroll", lockWindowScroll)
    window.addEventListener("scroll", lockWindowScroll, { passive: true })

    return () => {
      visualViewport?.removeEventListener("scroll", lockWindowScroll)
      window.removeEventListener("scroll", lockWindowScroll)
    }
  }, [enabled])
}
