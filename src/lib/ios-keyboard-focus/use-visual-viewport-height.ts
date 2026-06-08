"use client"

import { useVisualViewport } from "./use-visual-viewport"

export const useVisualViewportHeight = () => {
  const metrics = useVisualViewport()
  return metrics?.height ?? null
}
