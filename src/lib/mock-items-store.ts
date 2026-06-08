export type MockItem = {
  id: string
  name: string
  email: string
  quantity: string
}

export type MockItemInput = Omit<MockItem, "id">

export const createMockItem = (input: MockItemInput): MockItem => ({
  id: crypto.randomUUID(),
  ...input,
})
