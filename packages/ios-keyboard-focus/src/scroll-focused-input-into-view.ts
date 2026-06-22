import type { FocusableElement } from "./types"

export const KEYBOARD_SCROLL_INTO_VIEW_ATTR = "data-keyboard-scroll-into-view"

export type ScrollFocusedInputIntoViewOptions = {
  padding?: number
  force?: boolean
}

const DEFAULT_PADDING = 16

const isFocusableField = (
  element: Element | null
): element is FocusableElement | HTMLSelectElement =>
  element instanceof HTMLInputElement ||
  element instanceof HTMLTextAreaElement ||
  element instanceof HTMLSelectElement

export const shouldScrollFocusedInputIntoView = (
  element: Element
): boolean => {
  if (!isFocusableField(element)) {
    return false
  }

  const attr = element.getAttribute(KEYBOARD_SCROLL_INTO_VIEW_ATTR)

  if (attr === "false") {
    return false
  }

  return true
}

const getVisualViewportBounds = () => {
  const visualViewport = window.visualViewport

  if (!visualViewport) {
    return {
      top: 0,
      bottom: window.innerHeight,
    }
  }

  return {
    top: visualViewport.offsetTop,
    bottom: visualViewport.offsetTop + visualViewport.height,
  }
}

export const getKeyboardOverlap = (): number => {
  const visualViewport = window.visualViewport

  if (!visualViewport) {
    return 0
  }

  return Math.max(
    0,
    window.innerHeight - visualViewport.height - visualViewport.offsetTop
  )
}

const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
  let parent = element.parentElement

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent)

    if (
      (overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay") &&
      parent.scrollHeight > parent.clientHeight
    ) {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

const isElementVisibleInViewport = (
  element: HTMLElement,
  padding: number
): boolean => {
  const { top: viewportTop, bottom: viewportBottom } =
    getVisualViewportBounds()
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= viewportTop + padding &&
    rect.bottom <= viewportBottom - padding
  )
}

const scrollWithinContainer = (
  element: HTMLElement,
  container: HTMLElement,
  padding: number
) => {
  const { top: viewportTop, bottom: viewportBottom } =
    getVisualViewportBounds()
  const rect = element.getBoundingClientRect()

  if (rect.bottom > viewportBottom - padding) {
    container.scrollTop += rect.bottom - (viewportBottom - padding)
    return
  }

  if (rect.top < viewportTop + padding) {
    container.scrollTop -= viewportTop + padding - rect.top
  }
}

export const scrollFocusedInputIntoView = (
  element: FocusableElement | HTMLSelectElement,
  options: ScrollFocusedInputIntoViewOptions = {}
) => {
  const { padding = DEFAULT_PADDING, force = false } = options

  if (!shouldScrollFocusedInputIntoView(element)) {
    return
  }

  if (!force && isElementVisibleInViewport(element, padding)) {
    return
  }

  const scrollContainer = findScrollContainer(element)

  if (scrollContainer) {
    scrollWithinContainer(element, scrollContainer, padding)
    return
  }

  element.scrollIntoView({
    block: "nearest",
    inline: "nearest",
  })
}

export const scheduleScrollFocusedInputIntoView = (
  element: FocusableElement | HTMLSelectElement,
  options: ScrollFocusedInputIntoViewOptions = {}
) => {
  window.requestAnimationFrame(() => {
    scrollFocusedInputIntoView(element, options)

    window.requestAnimationFrame(() => {
      scrollFocusedInputIntoView(element, options)
    })
  })
}
