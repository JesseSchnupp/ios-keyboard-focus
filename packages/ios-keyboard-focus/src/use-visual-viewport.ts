"use client"

import { useEffect, useState } from "react"

export type VisualViewportMetrics = {
  height: number
  width: number
  offsetTop: number
  offsetLeft: number
}

const setVisualViewportCssVars = (metrics: VisualViewportMetrics) => {
  const root = document.documentElement

  root.style.setProperty("--visual-viewport-height", `${metrics.height}px`)
  root.style.setProperty("--visual-viewport-width", `${metrics.width}px`)
  root.style.setProperty("--visual-viewport-offset-top", `${metrics.offsetTop}px`)
  root.style.setProperty(
    "--visual-viewport-offset-left",
    `${metrics.offsetLeft}px`
  )
}

const getVisualViewportMetrics = (
  visualViewport: VisualViewport
): VisualViewportMetrics => ({
  height: visualViewport.height,
  width: visualViewport.width,
  offsetTop: visualViewport.offsetTop,
  offsetLeft: visualViewport.offsetLeft,
})

export const useVisualViewport = () => {
  const [metrics, setMetrics] = useState<VisualViewportMetrics | null>(null)

  useEffect(() => {
    const visualViewport = window.visualViewport

    if (!visualViewport) {
      return
    }

    const updateMetrics = () => {
      const nextMetrics = getVisualViewportMetrics(visualViewport)
      setMetrics(nextMetrics)
      setVisualViewportCssVars(nextMetrics)
    }

    updateMetrics()
    visualViewport.addEventListener("resize", updateMetrics)
    visualViewport.addEventListener("scroll", updateMetrics)

    return () => {
      visualViewport.removeEventListener("resize", updateMetrics)
      visualViewport.removeEventListener("scroll", updateMetrics)
    }
  }, [])

  return metrics
}
