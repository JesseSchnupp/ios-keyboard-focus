import { flushSync } from "react-dom"
import type { RefObject } from "react"
import { focusInput, focusWithIosKeyboard } from "./focus-with-ios-keyboard"
import type { FocusableElement, FocusWithIosKeyboardOptions } from "./types"

export const openModalWithInputFocus = (
  openModal: () => void,
  inputRef: RefObject<FocusableElement | null>,
  options: FocusWithIosKeyboardOptions = {}
) => {
  flushSync(() => {
    openModal()
  })

  const didFocus = focusInput(inputRef, options)

  if (!didFocus) {
    focusWithIosKeyboard(inputRef, options)
  }
}

export const refocusInputInModal = (
  inputRef: RefObject<FocusableElement | null>,
  options: FocusWithIosKeyboardOptions = {}
) => {
  const didFocus = focusInput(inputRef, options)

  if (!didFocus) {
    focusWithIosKeyboard(inputRef, options)
  }
}
