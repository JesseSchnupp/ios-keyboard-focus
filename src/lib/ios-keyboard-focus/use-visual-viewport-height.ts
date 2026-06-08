"use client"

import { useEffect, useState } from "react"

const setVisualViewportCssVar = (height: number) => {
  document.documentElement.style.setProperty(
    "--visual-viewport-height",
    `${height}px`
  )
}

export const useVisualViewportHeight = () => {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const visualViewport = window.visualViewport

    if (!visualViewport) {
      return
    }

    const updateHeight = () => {
      const nextHeight = visualViewport.height
      setHeight(nextHeight)
      setVisualViewportCssVar(nextHeight)
    }

    updateHeight()
    visualViewport.addEventListener("resize", updateHeight)
    visualViewport.addEventListener("scroll", updateHeight)

    return () => {
      visualViewport.removeEventListener("resize", updateHeight)
      visualViewport.removeEventListener("scroll", updateHeight)
    }
  }, [])

  return height
}
