"use client"

import { useEffect, type RefObject } from "react"
import {
  getKeyboardOverlap,
  scheduleScrollFocusedInputIntoView,
  scrollFocusedInputIntoView,
  shouldScrollFocusedInputIntoView,
} from "./scroll-focused-input-into-view"
import type { ScrollFocusedInputIntoViewOptions } from "./scroll-focused-input-into-view"

type UseScrollFocusedInputIntoViewOptions = ScrollFocusedInputIntoViewOptions & {
  enabled?: boolean
}

const isFocusableFieldElement = (
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLTextAreaElement ||
  element instanceof HTMLSelectElement

const updateScrollContainerPadding = (element: HTMLElement) => {
  const scrollContainer = findScrollContainerForPadding(element)

  if (!scrollContainer) {
    return
  }

  const overlap = getKeyboardOverlap()
  scrollContainer.style.scrollPaddingBottom = `${overlap + 16}px`
}

const findScrollContainerForPadding = (
  element: HTMLElement
): HTMLElement | null => {
  let parent = element.parentElement

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent)

    if (
      overflowY === "auto" ||
      overflowY === "scroll" ||
      overflowY === "overlay"
    ) {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

export const useScrollFocusedInputIntoView = (
  containerRef: RefObject<HTMLElement | null>,
  options: UseScrollFocusedInputIntoViewOptions = {}
) => {
  const { enabled = true, padding, force } = options

  useEffect(() => {
    if (!enabled) {
      return
    }

    const container = containerRef.current

    if (!container) {
      return
    }

    const scrollOptions = { padding, force }

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target

      if (!(target instanceof Element) || !isFocusableFieldElement(target)) {
        return
      }

      if (!container.contains(target)) {
        return
      }

      if (!shouldScrollFocusedInputIntoView(target)) {
        return
      }

      scheduleScrollFocusedInputIntoView(target, scrollOptions)
    }

    const handleViewportChange = () => {
      const activeElement = document.activeElement

      if (
        !isFocusableFieldElement(activeElement) ||
        !container.contains(activeElement)
      ) {
        return
      }

      if (!shouldScrollFocusedInputIntoView(activeElement)) {
        return
      }

      updateScrollContainerPadding(activeElement)
      scrollFocusedInputIntoView(activeElement, scrollOptions)
    }

    container.addEventListener("focusin", handleFocusIn)
    window.visualViewport?.addEventListener("resize", handleViewportChange)
    window.visualViewport?.addEventListener("scroll", handleViewportChange)

    return () => {
      container.removeEventListener("focusin", handleFocusIn)
      window.visualViewport?.removeEventListener("resize", handleViewportChange)
      window.visualViewport?.removeEventListener("scroll", handleViewportChange)
    }
  }, [containerRef, enabled, force, padding])
}
