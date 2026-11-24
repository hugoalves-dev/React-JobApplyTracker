import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { Switch } from '@/components/ui/Toggle'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { CenteredSpinner, ErrorNote, Spinner } from '@/components/ui/feedback'
import { useAsync } from '@/hooks/useAsync'
import { errorMessage } from '@/lib/utils'
import {
  deleteTinyFetchSettings,
  disconnectGmailAccount,
  getGmailStatus,
  getTinyFetchSettings,
  renameGmailAccount,
  startGmailOAuth,
  testGmailAccount,
  testTinyFetch,
  updateTinyFetchSettings,
  type GmailAccount,
  type GmailStatus,
  type IntegrationTestResult,
  type TinyFetchSettings,
} from '@/api/integrations'

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded border border-mono-e5">
      <div className="px-[18px] pb-3.5 pt-4">
        <div className="text-[14.5px] font-semibold">{title}</div>
        {sub && <div className="mt-0.5 text-[12.5px] text-mono-9">{sub}</div>}
      </div>
      <hr className="border-mono-e5" />
      <div className="p-[18px]">{children}</div>
    </div>
  )
}

function StatusPill({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mono-e5 px-2.5 py-[3px] font-mono text-xs text-mono-2">
      <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-mono-1' : 'bg-mono-c'}`} />
      {label}
    </span>
  )
}

function TestNote({ result }: { result: IntegrationTestResult | null }) {
  if (!result) return null
  return (
    <div className={`mt-3 font-mono text-[11.5px] ${result.success ? 'text-mono-5' : 'text-danger'}`}>
      {result.success ? '✓' : '✗'} {result.message} · {result.latencyMs} ms
    </div>
  )
}

function TinyFetchSection() {
  const { data, loading, reload } = useAsync<TinyFetchSettings | null>(
    () => getTinyFetchSettings().catch(() => null),
    [],
  )
  const [apiKey, setApiKey] = useState('')
  const [perMinute, setPerMinute] = useState('')
  const [daily, setDaily] = useState('')
  const [busy, setBusy] = useState<'save' | 'toggle' | 'test' | 'delete' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [test, setTest] = useState<IntegrationTestResult | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (data) {
      setPerMinute(String(data.perMinuteLimit))
      setDaily(String(data.dailyLimit))
    }
  }, [data])

  const run = async (kind: NonNullable<typeof busy>, action: () => Promise<unknown>, fallback: string) => {
    setBusy(kind)
    setError(null)
    try {
      await action()
      reload()
    } catch (err) {
      setError(errorMessage(err, fallback))
    } finally {
      setBusy(null)
    }
  }

  const save = () =>
    run(
      'save',
      async () => {
        await updateTinyFetchSettings({
          apiKey: apiKey.trim() || undefined,
          perMinuteLimit: perMinute ? Number(perMinute) : undefined,
          dailyLimit: daily ? Number(daily) : undefined,
        })
        setApiKey('')
        setTest(null)
      },
      'Could not save TinyFish settings.',
    )

  const toggle = (enabled: boolean) =>
    run('toggle', () => updateTinyFetchSettings({ enabled }), 'Could not update TinyFish settings.')

  const runTest = () =>
    run('test', async () => setTest(await testTinyFetch()), 'Could not test TinyFish Fetch.')

  const remove = () => {
    setConfirmDelete(false)
    return run(
      'delete',
      async () => {
        await deleteTinyFetchSettings()
        setTest(null)
      },
      'Could not remove TinyFish settings.',
    )
  }

  const configured = !!data?.configured
  const enabled = configured && !!data?.enabled

  return (
    <Card title="TinyFish Fetch" sub="Let the AI read job posts from shared URLs using your own TinyFish key">
      {loading && !data ? (
        <CenteredSpinner />
      ) : (
        <>
          {error && (
            <div className="mb-4">
              <ErrorNote message={error} />
            </div>
          )}
          {data && !data.serverReady && (
            <div className="mb-4">
              <ErrorNote message="Integration secrets are not enabled on the server yet." />
            </div>
          )}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1 text-[13px]">
              {configured ? (
                <>
                  Key <span className="font-mono text-mono-5">{data?.apiKeyHint ?? '••••'}</span> · used today{' '}
                  <span className="font-mono">{data?.usedToday ?? 0}</span>/{data?.dailyLimit}
                </>
              ) : (
                <span className="text-mono-9">Not configured</span>
              )}
            </div>
            <StatusPill on={enabled} label={enabled ? 'Enabled' : configured ? 'Disabled' : 'Off'} />
            {configured && (
              <Switch
                checked={enabled}
                onChange={(value) => toggle(value)}
                aria-label="Enable TinyFish Fetch"
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={configured ? 'Replace API key' : 'API key'}
              full
              htmlFor="tinyfetch-key"
              hint="Stored encrypted. It is never shown again."
            >
              <Input
                id="tinyfetch-key"
                type="password"
                autoComplete="off"
                className="mono"
                placeholder={configured ? 'Leave empty to keep the current key' : 'Paste your TinyFish API key'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Field>
            <Field label={`Per minute (max ${data?.maxPerMinuteLimit ?? 150})`} htmlFor="tinyfetch-minute">
              <Input
                id="tinyfetch-minute"
                type="number"
                min={1}
                max={data?.maxPerMinuteLimit}
                className="mono"
                value={perMinute}
                onChange={(e) => setPerMinute(e.target.value)}
              />
            </Field>
            <Field label={`Per day (max ${data?.maxDailyLimit ?? 1000})`} htmlFor="tinyfetch-day">
              <Input
                id="tinyfetch-day"
                type="number"
                min={1}
                max={data?.maxDailyLimit}
                className="mono"
                value={daily}
                onChange={(e) => setDaily(e.target.value)}
              />
            </Field>
          </div>

          <TestNote result={test} />
          {!test && data?.lastTestedAt && (
            <div className={`mt-3 font-mono text-[11.5px] ${data.lastTestSuccess ? 'text-mono-9' : 'text-danger'}`}>
              Last test {new Date(data.lastTestedAt).toLocaleString()}: {data.lastTestMessage}
            </div>
          )}

          <div className="mt-[18px] flex flex-wrap items-center justify-end gap-2">
            {configured && (
              <>
                <Button size="sm" className="text-danger" onClick={() => setConfirmDelete(true)} disabled={!!busy}>
                  {busy === 'delete' ? <Spinner /> : 'Remove'}
                </Button>
                <Button size="sm" onClick={runTest} disabled={!!busy}>
                  {busy === 'test' ? <Spinner /> : 'Test'}
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={save}
              disabled={!!busy || (!configured && !apiKey.trim())}
            >
              {busy === 'save' ? <Spinner className="border-mono-5 border-t-mono-w" /> : 'Save'}
            </Button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Remove TinyFish Fetch?"
        message="The stored API key is deleted. The AI will ask you to paste job descriptions instead."
        confirmLabel="Remove"
        destructive
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </Card>
  )
}

function GmailAccountRow({ account, onChanged }: { account: GmailAccount; onChanged: () => void }) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(account.profileName)
  const [busy, setBusy] = useState<'rename' | 'test' | 'disconnect' | 'reconnect' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [test, setTest] = useState<IntegrationTestResult | null>(null)
  const [confirm, setConfirm] = useState(false)

  const run = async (kind: NonNullable<typeof busy>, action: () => Promise<unknown>, fallback: string) => {
    setBusy(kind)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(errorMessage(err, fallback))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="px-3.5 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <div className="min-w-[180px] flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="field-input min-w-0 flex-1"
                value={profile}
                maxLength={60}
                aria-label="Profile name"
                onChange={(e) => setProfile(e.target.value)}
              />
              <Button
                size="sm"
                disabled={!!busy || !profile.trim()}
                onClick={() =>
                  run(
                    'rename',
                    async () => {
                      await renameGmailAccount(account.id, profile.trim())
                      setEditing(false)
                      onChanged()
                    },
                    'Could not rename profile.',
                  )
                }
              >
                {busy === 'rename' ? <Spinner /> : 'Save'}
              </Button>
              <Button size="sm" onClick={() => { setEditing(false); setProfile(account.profileName) }}>
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="truncate text-[13px] font-medium">{account.profileName}</div>
              <div className="mono truncate text-xs text-mono-9">{account.email}</div>
            </>
          )}
        </div>
        {!editing && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {account.reauthorizationRequired ? (
              <Button
                size="sm"
                disabled={!!busy}
                onClick={() =>
                  run(
                    'reconnect',
                    async () => {
                      const { authorizationUrl } = await startGmailOAuth(account.profileName)
                      window.location.href = authorizationUrl
                    },
                    'Could not start reconnection.',
                  )
                }
              >
                {busy === 'reconnect' ? <Spinner /> : 'Reconnect'}
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={!!busy}
                onClick={() => run('test', async () => setTest(await testGmailAccount(account.id)), 'Test failed.')}
              >
                {busy === 'test' ? <Spinner /> : 'Test'}
              </Button>
            )}
            <Button size="sm" disabled={!!busy} onClick={() => setEditing(true)}>
              Rename
            </Button>
            <Button size="sm" className="text-danger" disabled={!!busy} onClick={() => setConfirm(true)}>
              {busy === 'disconnect' ? <Spinner /> : 'Disconnect'}
            </Button>
          </div>
        )}
      </div>
      {account.reauthorizationRequired && (
        <div className="mt-2 font-mono text-[11.5px] text-danger">Access expired or was revoked. Reconnect this account.</div>
      )}
      {error && (
        <div className="mt-2">
          <ErrorNote message={error} />
        </div>
      )}
      <TestNote result={test} />
      <ConfirmDialog
        open={confirm}
        title={`Disconnect ${account.email}?`}
        message="Applywell revokes its Google access for this mailbox. Existing drafts stay in Gmail."
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => {
          setConfirm(false)
          run('disconnect', async () => {
            await disconnectGmailAccount(account.id)
            onChanged()
          }, 'Could not disconnect the account.')
        }}
        onCancel={() => setConfirm(false)}
      />
    </div>
  )
}

function GmailSection() {
  const { data, loading, reload } = useAsync<GmailStatus | null>(() => getGmailStatus().catch(() => null), [])
  const [searchParams, setSearchParams] = useSearchParams()
  const [profile, setProfile] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    if (searchParams.get('integration') !== 'gmail') return
    const status = searchParams.get('status')
    setNotice({
      ok: status === 'success',
      message: searchParams.get('message') ?? (status === 'success' ? 'Gmail connected' : 'Gmail connection failed'),
    })
    const next = new URLSearchParams(searchParams)
    ;['integration', 'status', 'message'].forEach((key) => next.delete(key))
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const connect = async () => {
    setBusy(true)
    setError(null)
    try {
      const { authorizationUrl } = await startGmailOAuth(profile.trim() || undefined)
      window.location.href = authorizationUrl
    } catch (err) {
      setError(errorMessage(err, 'Could not start the Gmail connection.'))
      setBusy(false)
    }
  }

  const accounts = data?.accounts ?? []
  const atLimit = !!data && accounts.length >= data.maxAccounts

  return (
    <Card title="Gmail drafts" sub="Let the AI prepare application emails as Gmail drafts. Nothing is ever sent automatically.">
      {notice && (
        <div className={`mb-4 font-mono text-[12px] ${notice.ok ? 'text-mono-5' : 'text-danger'}`}>
          {notice.ok ? '✓' : '✗'} {notice.message}
        </div>
      )}
      {error && (
        <div className="mb-4">
          <ErrorNote message={error} />
        </div>
      )}
      {loading && !data ? (
        <CenteredSpinner />
      ) : data && !data.serverConfigured ? (
        <div className="text-[13px] text-mono-9">Gmail is not configured on this server yet.</div>
      ) : (
        <>
          {accounts.length > 0 ? (
            <div className="mb-4 flex flex-col divide-y divide-mono-e5 overflow-hidden rounded border border-mono-e5">
              {accounts.map((account) => (
                <GmailAccountRow key={account.id} account={account} onChanged={reload} />
              ))}
            </div>
          ) : (
            <div className="mb-4 py-1 text-[13px] text-mono-9">No Gmail accounts connected.</div>
          )}

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1">
              <Field label="Profile name (optional)" htmlFor="gmail-profile">
                <Input
                  id="gmail-profile"
                  maxLength={60}
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  disabled={atLimit}
                />
              </Field>
            </div>
            <Button size="sm" onClick={connect} disabled={busy || atLimit}>
              {busy ? <Spinner /> : '+ Connect Gmail'}
            </Button>
          </div>
          <div className="mt-3 text-[11.5px] text-mono-9">
            Use a profile such as &quot;Java&quot; or &quot;CSharp&quot; to pick the mailbox per draft; it defaults to the mailbox name.
            Requests only permission to create drafts ({data?.scopes?.join(', ') || 'gmail.compose'}).
            {atLimit && ` You reached the limit of ${data?.maxAccounts} accounts.`}
          </div>
        </>
      )}
    </Card>
  )
}

export function IntegrationsSettings() {
  return (
    <>
      <TinyFetchSection />
      <GmailSection />
    </>
  )
}
