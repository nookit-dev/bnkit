import { HtmlDocument } from './html-document'
import { AppEntry } from './fullstack-state'
import React from 'react'

const isServer = () => {
  return typeof window === 'undefined'
}

const useIsServer = () => {
  const [server, setServer] = React.useState(isServer())

  React.useEffect(() => {
    setServer(isServer())
  }, [])

  return server
}

export const RenderApp = <State,>({ retrieveStateFn }: { retrieveStateFn?: (...args: any[]) => State }) => {
  const isServer = useIsServer()
  return (
    <HtmlDocument entryFilePath={'/build/base.js'}>
      <AppEntry defaultState={{ ...(retrieveStateFn?.() || {}) }} />
      {isServer}
    </HtmlDocument>
  )
}
