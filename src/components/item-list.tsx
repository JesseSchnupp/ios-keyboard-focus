import type { MockItem } from "@/lib/mock-items-store"

type ItemListProps = {
  items: MockItem[]
}

export const ItemList = ({ items }: ItemListProps) => {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No items yet. Tap Add Item to create one.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {item.name}
          </p>
          {item.email ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {item.email}
            </p>
          ) : null}
          {item.quantity ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Qty: {item.quantity}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
