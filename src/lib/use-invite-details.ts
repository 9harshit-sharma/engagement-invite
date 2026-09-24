"use client"

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react"
import {
  DEFAULT_INVITE,
  STORAGE_KEY,
  parseInvite,
  type InviteDetails,
} from "@/lib/invite"

type Store = {
  listeners: Set<() => void>
  cachedRaw: string | null | undefined
  cachedDetails: InviteDetails
}

const stores = new Map<string, Store>()

function getStore(storageKey: string, base: InviteDetails): Store {
  const existing = stores.get(storageKey)
  if (existing) return existing
  const created: Store = {
    listeners: new Set(),
    cachedRaw: undefined,
    cachedDetails: base,
  }
  stores.set(storageKey, created)
  return created
}

function emit(store: Store) {
  for (const listener of store.listeners) listener()
}

export function useInviteDetails(
  hostEdit: boolean,
  base: InviteDetails = DEFAULT_INVITE,
  storageKey: string = STORAGE_KEY,
) {
  const store = useMemo(() => getStore(storageKey, base), [storageKey, base])

  const subscribe = useCallback(
    (listener: () => void) => {
      store.listeners.add(listener)
      return () => store.listeners.delete(listener)
    },
    [store],
  )

  const snapshot = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw !== store.cachedRaw) {
        store.cachedRaw = raw
        store.cachedDetails = parseInvite(raw, base)
      }
      return store.cachedDetails
    } catch {
      return base
    }
  }, [base, storageKey, store])

  const publicSnapshot = useCallback(() => base, [base])

  useEffect(() => {
    store.cachedDetails = base
    store.cachedRaw = undefined
  }, [base, store])

  const details = useSyncExternalStore(
    subscribe,
    hostEdit ? snapshot : publicSnapshot,
    publicSnapshot,
  )

  const setDetails = useCallback(
    (next: InviteDetails) => {
      if (!hostEdit) return
      store.cachedRaw = JSON.stringify(next)
      store.cachedDetails = next
      window.localStorage.setItem(storageKey, store.cachedRaw)
      emit(store)
    },
    [hostEdit, storageKey, store],
  )

  return { details, setDetails }
}
