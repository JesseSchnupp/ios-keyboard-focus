"use client"

import { useRef, useState } from "react"
import { AddItemModal } from "@/components/add-item-modal"
import { ItemList } from "@/components/item-list"
import { openModalWithInputFocus } from "@/lib/ios-keyboard-focus"
import { createMockItem, type MockItem } from "@/lib/mock-items-store"

export default function Home() {
  const [items, setItems] = useState<MockItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleOpenModal = () => {
    openModalWithInputFocus(() => setIsModalOpen(true), nameInputRef, {
      selectOnFocus: true,
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddItem = (input: Parameters<typeof createMockItem>[0]) => {
    setItems((current) => [createMockItem(input), ...current])
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6 sm:py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl dark:text-zinc-100">
          iOS Keyboard Focus
        </h1>
        <p className="text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
          Demo for opening a modal, focusing the first input, and keeping the
          page stable when the mobile keyboard appears.
        </p>
      </header>

      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold whitespace-nowrap text-white hover:bg-blue-700 sm:w-auto sm:self-start"
        aria-label="Open add item modal"
      >
        Add Item
      </button>

      <section aria-label="Saved items">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Items
        </h2>
        <ItemList items={items} />
      </section>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        nameInputRef={nameInputRef}
      />
    </main>
  )
}
