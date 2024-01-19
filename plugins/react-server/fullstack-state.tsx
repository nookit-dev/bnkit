import React from 'react'
// this file is just an example
import { createContext, useEffect, useState } from 'react'

export type ContextStateT<StateT extends object = {}> = {
  state: StateT
  updateKey: <Key extends keyof StateT = keyof StateT>(key: Key, value: StateT[Key]) => void
}

export type ReactContextT<StateT extends object = {}> = React.Context<ContextStateT<StateT>>

const isServer = () => {
  return typeof window === 'undefined'
}

export const appState = {
  count: 0,
}

export type AppStateT = typeof appState

const initState = async <StateT extends object>() => {
  const isServerSide = isServer()

  if (isServerSide) {
    return {
      ...appState,
    }
  }

  const res = await fetch('/state', {
    method: 'get',
  })

  const json = await res.json()

  return json as StateT
}

const AppContext = createContext<{
  state: typeof appState
  updateKey: <Key extends keyof typeof appState = keyof typeof appState>(
    key: Key,
    value: (typeof appState)[Key],
  ) => void
}>({
  state: { count: 0 },
  updateKey: () => {},
})

const clientToServerStateKeyUpdate = async <StateT extends object, Key extends keyof StateT = keyof StateT>(
  key: Key,
  value: StateT[Key],
) => {
  const res = await fetch('/state', {
    method: 'post',
    body: JSON.stringify({
      type: 'partial',
      state: {
        [key]: value,
      },
    }),
  })
  const json = await res.json()
  return json
}

export const StateProvider = <StateT extends object>({
  children,
  defaultState,
}: {
  children: React.ReactNode
  defaultState?: StateT
}) => {
  const [state, setState] = useState<StateT>(() => (defaultState || {}) as StateT)

  useEffect(() => {
    initState().then((state) => {
      setState((prev) => ({
        ...prev,
        ...state,
      }))
    })
  }, [])

  const isServerSide = isServer()

  const updateKey = async <Key extends keyof StateT = keyof StateT>(key: Key, value: StateT[Key]) => {
    if (isServerSide) return null

    setState((prev) => ({
      ...prev,
      [key]: value,
    }))
    clientToServerStateKeyUpdate<StateT>(key, value)
  }

  return <AppContext.Provider value={{ state, updateKey }}>{children}</AppContext.Provider>
}

const useClientAppState = () => {
  const { state, updateKey } = React.useContext(AppContext)

  return {
    state,
    updateKey,
  }
}

const Counter = () => {
  const { state, updateKey } = useClientAppState()

  return (
    <div>
      <div>Count: {state.count}</div>
      <button onClick={() => updateKey('count', (state.count || 0) + 1)}>Increment</button>
    </div>
  )
}

export const AppEntry = <StateT extends object>({ defaultState }: { defaultState: StateT }) => {
  return (
    <StateProvider defaultState={defaultState}>
      <Counter />
    </StateProvider>
  )
}
