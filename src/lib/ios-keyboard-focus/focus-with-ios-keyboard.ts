import type { RefObject } from "react"
import type { FocusableElement, FocusWithIosKeyboardOptions } from "./types"

const createAnchorInput = () => {
  const anchor = document.createElement("input")
  anchor.setAttribute("type", "text")
  anchor.setAttribute("aria-hidden", "true")
  anchor.setAttribute("tabindex", "-1")
  anchor.readOnly = true

  Object.assign(anchor.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "1px",
    height: "1px",
    opacity: "0",
    fontSize: "16px",
    pointerEvents: "none",
    border: "0",
    padding: "0",
    margin: "0",
  })

  return anchor
}

const focusElement = (
  element: FocusableElement,
  selectOnFocus: boolean
) => {
  element.focus({ preventScroll: true })

  if (selectOnFocus && "select" in element) {
    element.select()
  }
}

export const focusWithIosKeyboard = (
  targetRef: RefObject<FocusableElement | null>,
  options: FocusWithIosKeyboardOptions = {}
) => {
  const { delayMs = 0, selectOnFocus = false } = options
  const target = targetRef.current

  if (!target) {
    return
  }

  const anchor = createAnchorInput()
  document.body.appendChild(anchor)
  anchor.focus({ preventScroll: true })

  const transferFocus = () => {
    if (!targetRef.current) {
      anchor.remove()
      return
    }

    focusElement(targetRef.current, selectOnFocus)
    anchor.remove()
  }

  if (delayMs > 0) {
    window.setTimeout(transferFocus, delayMs)
    return
  }

  transferFocus()
}

export const focusInput = (
  targetRef: RefObject<FocusableElement | null>,
  options: FocusWithIosKeyboardOptions = {}
) => {
  const { selectOnFocus = false } = options
  const target = targetRef.current

  if (!target) {
    return false
  }

  focusElement(target, selectOnFocus)

  if (document.activeElement === target) {
    return true
  }

  focusWithIosKeyboard(targetRef, options)
  return document.activeElement === targetRef.current
}
