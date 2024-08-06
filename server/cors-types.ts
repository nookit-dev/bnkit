import tyep { CommonHttpHeaders, RouteMethods } from '../utils/http-types'

export type CORSOptions = {
  origins?: string[]
  methods?: RouteMethods[]
  headers?: CommonHttpHeaders[] | string[]
  credentials?: boolean
}
export type ClientCORSCredentialOpts = 'omit' | 'same-origin' | 'include'
