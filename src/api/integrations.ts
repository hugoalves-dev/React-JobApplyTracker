import { api, unwrap } from '@/lib/api'

export interface TinyFetchSettings {
  configured: boolean
  enabled: boolean
  apiKeyHint?: string
  perMinuteLimit: number
  dailyLimit: number
  maxPerMinuteLimit: number
  maxDailyLimit: number
  usedToday: number
  lastTestedAt?: string
  lastTestSuccess?: boolean
  lastTestMessage?: string
  serverReady: boolean
}

export interface TinyFetchSettingsUpdate {
  apiKey?: string
  enabled?: boolean
  perMinuteLimit?: number
  dailyLimit?: number
}

export interface IntegrationTestResult {
  success: boolean
  message: string
  latencyMs: number
}

export const getTinyFetchSettings = () =>
  unwrap(api.get<TinyFetchSettings>('/integrations/tinyfetch'))

export const updateTinyFetchSettings = (data: TinyFetchSettingsUpdate) =>
  unwrap(api.put<TinyFetchSettings>('/integrations/tinyfetch', data))

export const deleteTinyFetchSettings = () => api.delete('/integrations/tinyfetch')

export const testTinyFetch = () =>
  unwrap(api.post<IntegrationTestResult>('/integrations/tinyfetch/test'))

export interface GmailAccount {
  id: string
  email: string
  profileName: string
  connectedAt: string
  lastTestedAt?: string
  reauthorizationRequired: boolean
}

export interface GmailStatus {
  serverConfigured: boolean
  maxAccounts: number
  scopes: string[]
  accounts: GmailAccount[]
}

export const getGmailStatus = () => unwrap(api.get<GmailStatus>('/integrations/gmail'))

export const startGmailOAuth = (profileName?: string) =>
  unwrap(
    api.post<{ authorizationUrl: string }>('/integrations/gmail/oauth/start', {
      profileName: profileName || undefined,
    }),
  )

export const renameGmailAccount = (id: string, profileName: string) =>
  unwrap(api.patch<GmailAccount>(`/integrations/gmail/accounts/${id}`, { profileName }))

export const testGmailAccount = (id: string) =>
  unwrap(api.post<IntegrationTestResult>(`/integrations/gmail/accounts/${id}/test`))

export const disconnectGmailAccount = (id: string) =>
  api.delete(`/integrations/gmail/accounts/${id}`)
