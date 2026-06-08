"use client"

import { useCallback } from "react"
import { focusInput, focusWithIosKeyboard } from "./focus-with-ios-keyboard"
import type { UseIosInputFocusOptions } from "./types"

export const useIosInputFocus = ({
  inputRef,
  enabled = true,
}: UseIosInputFocusOptions) => {
  const refocus = useCallback(
    (options?: { selectOnFocus?: boolean }) => {
      if (!enabled) {
        return false
      }

      return focusInput(inputRef, options)
    },
    [enabled, inputRef]
  )

  const refocusWithFallback = useCallback(
    (options?: { selectOnFocus?: boolean; delayMs?: number }) => {
      if (!enabled) {
        return
      }

      const didFocus = focusInput(inputRef, options)

      if (!didFocus) {
        focusWithIosKeyboard(inputRef, options)
      }
    },
    [enabled, inputRef]
  )

  return {
    refocus,
    refocusWithFallback,
  }
}
