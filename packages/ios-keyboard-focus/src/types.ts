import type { RefObject } from "react"

export type FocusableElement = HTMLInputElement | HTMLTextAreaElement

export type FocusWithIosKeyboardOptions = {
  delayMs?: number
  selectOnFocus?: boolean
  scrollIntoView?: boolean
}

export type UseIosInputFocusOptions = {
  inputRef: RefObject<FocusableElement | null>
  enabled?: boolean
}
