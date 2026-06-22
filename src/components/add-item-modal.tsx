"use client"

import { useState, type RefObject } from "react"
import { flushSync } from "react-dom"
import {
  KeyboardModalShell,
  refocusInputInModal,
} from "@/lib/ios-keyboard-focus"
import type { MockItemInput } from "@/lib/mock-items-store"

const SCROLL_TEST_FIELD_COUNT = 30

type FormState = {
  name: string
  email: string
  quantity: string
  scrollTestFields: string[]
}

const emptyFormState = (): FormState => ({
  name: "",
  email: "",
  quantity: "",
  scrollTestFields: Array.from({ length: SCROLL_TEST_FIELD_COUNT }, () => ""),
})

type AddItemModalProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: MockItemInput) => void
  nameInputRef: RefObject<HTMLInputElement | null>
}

export const AddItemModal = ({
  isOpen,
  onClose,
  onAdd,
  nameInputRef,
}: AddItemModalProps) => {
  const [formState, setFormState] = useState<FormState>(emptyFormState)
  const [error, setError] = useState<string | null>(null)

  const clearForm = () => {
    setFormState(emptyFormState())
    setError(null)
  }

  const validateForm = () => {
    if (!formState.name.trim()) {
      setError("Name is required")
      return false
    }

    setError(null)
    return true
  }

  const getFormValues = (): MockItemInput => ({
    name: formState.name.trim(),
    email: formState.email.trim(),
    quantity: formState.quantity.trim(),
  })

  const handleAdd = () => {
    if (!validateForm()) {
      return
    }

    onAdd(getFormValues())
    clearForm()
    nameInputRef.current?.blur()
    onClose()
  }

  const handleAddAnother = () => {
    if (!validateForm()) {
      return
    }

    onAdd(getFormValues())

    flushSync(() => {
      clearForm()
    })

    refocusInputInModal(nameInputRef, { selectOnFocus: true })
  }

  const handleNameChange = (value: string) => {
    setFormState((current) => ({ ...current, name: value }))
    if (error) {
      setError(null)
    }
  }

  const handleScrollTestFieldChange = (index: number, value: string) => {
    setFormState((current) => ({
      ...current,
      scrollTestFields: current.scrollTestFields.map((fieldValue, fieldIndex) =>
        fieldIndex === index ? value : fieldValue,
      ),
    }))
  }

  return (
    <KeyboardModalShell
      isOpen={isOpen}
      viewportMode="overlay"
      aria-labelledby="add-item-modal-title"
      className="z-50 flex flex-col bg-background"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h2
          id="add-item-modal-title"
          className="text-lg font-semibold sm:text-xl"
        >
          Add Item
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-label="Close add item modal"
        >
          Close
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-4">
        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            handleAdd()
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Name
            </span>
            <input
              ref={nameInputRef}
              type="text"
              inputMode="text"
              value={formState.name}
              onChange={(event) => handleNameChange(event.target.value)}
              autoComplete="off"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              aria-label="Item name"
              aria-invalid={error ? true : undefined}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Email
            </span>
            <input
              type="email"
              inputMode="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              aria-label="Item email"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Quantity
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formState.quantity}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  quantity: event.target.value,
                }))
              }
              autoComplete="off"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              aria-label="Item quantity"
            />
          </label>

          <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Scroll test fields
            </p>
            {formState.scrollTestFields.map((value, index) => (
              <label key={`scroll-test-field-${index + 1}`} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Test field {index + 1}
                </span>
                <input
                  type="text"
                  inputMode="text"
                  value={value}
                  onChange={(event) =>
                    handleScrollTestFieldChange(index, event.target.value)
                  }
                  autoComplete="off"
                  placeholder={`Enter value for test field ${index + 1}`}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  aria-label={`Scroll test field ${index + 1}`}
                />
              </label>
            ))}
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <footer className="shrink-0 border-t border-zinc-200 bg-background px-4 py-3 dark:border-zinc-800">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleAddAnother}
            className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm font-semibold whitespace-nowrap text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900 sm:flex-1"
            aria-label="Add item and prepare another"
          >
            Add Another
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold whitespace-nowrap text-white hover:bg-blue-700 sm:flex-1"
            aria-label="Add item and close modal"
          >
            Add
          </button>
        </div>
      </footer>
    </KeyboardModalShell>
  )
}
