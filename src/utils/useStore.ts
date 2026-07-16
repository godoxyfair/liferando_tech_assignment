import { useSyncExternalStore } from 'react'
import type { StoreApi } from 'zustand'

// Subscribe a component to a vanilla zustand store (StoreApi). Returns the whole
// state and re-renders on any change — fine for the small wizard flow store.
export function useStore<T extends object>(store: StoreApi<T>) {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState(),
    () => store.getState(),
  )
}
