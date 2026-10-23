import { test, expect, setupAuthed } from './support/fixtures'

for (const [answer, count] of [['Yes, add interview', 3], ['No, keep count', 2]] as const) {
  test(`status confirmation: ${answer}`, async ({ page }) => {
    await setupAuthed(page)
    await page.goto('/applications/app-1/edit')
    await page.getByLabel('Interviews', { exact: true }).fill('2')
    await page.getByLabel('Status', { exact: true }).selectOption('Pending HR Response')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Did you complete an interview?' })
    await expect(dialog).toBeVisible()
    const request = page.waitForRequest(r => r.method() === 'PUT' && r.url().endsWith('/applications/app-1'))
    await dialog.getByRole('button', { name: answer }).click()
    expect((await request).postDataJSON().interviewCount).toBe(count)
    await expect(page).toHaveURL(/\/applications$/)
  })
}

test('closing confirmation leaves the form unsaved', async ({ page }) => {
  await setupAuthed(page)
  const saves: unknown[] = []
  page.on('request', r => { if (r.method() === 'PUT') saves.push(r.postDataJSON()) })
  await page.goto('/applications/app-1/edit')
  await page.getByLabel('Status', { exact: true }).selectOption('Pending HR Response')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Did you complete an interview?' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeEnabled()
  expect(saves).toEqual([])
  await expect(page).toHaveURL(/app-1\/edit$/)
})

for (const status of ['RH', 'Rejected']) {
  test(`saving ${status} does not ask or increment`, async ({ page }) => {
    await setupAuthed(page)
    await page.goto('/applications/app-1/edit')
    await page.getByLabel('Interviews', { exact: true }).fill('2')
    await page.getByLabel('Status', { exact: true }).selectOption(status)
    const request = page.waitForRequest(r => r.method() === 'PUT' && r.url().endsWith('/applications/app-1'))
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    expect((await request).postDataJSON().interviewCount).toBe(2)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
}

test('moving between interview stages asks and adds one', async ({ page }) => {
  await setupAuthed(page)
  await page.goto('/applications/app-3/edit')
  await page.getByLabel('Interviews', { exact: true }).fill('1')
  await page.getByLabel('Status', { exact: true }).selectOption('Pending Hiring Manager Response')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  const request = page.waitForRequest(r => r.method() === 'PUT' && r.url().endsWith('/applications/app-3'))
  await page.getByRole('button', { name: 'Yes, add interview' }).click()
  expect((await request).postDataJSON().interviewCount).toBe(2)
})

test('retrying after a save error resends the same confirmed total', async ({ page }) => {
  await setupAuthed(page)
  const totals: number[] = []
  await page.route('**/api/v1/applications/app-1', async route => {
    if (route.request().method() !== 'PUT') return route.fallback()
    const body = route.request().postDataJSON()
    totals.push(body.interviewCount)
    if (totals.length === 1) {
      return route.fulfill({ status: 500, json: { message: 'Save failed' } })
    }
    return route.fulfill({ json: { id: 'app-1', ...body } })
  })
  await page.goto('/applications/app-1/edit')
  await page.getByLabel('Interviews', { exact: true }).fill('2')
  await page.getByLabel('Status', { exact: true }).selectOption('Pending Hiring Manager Response')
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.getByRole('button', { name: 'Yes, add interview' }).click()
    if (attempt === 0) await expect(page.getByText('Save failed', { exact: true })).toBeVisible()
  }
  await expect(page).toHaveURL(/\/applications$/)
  expect(totals).toEqual([3, 3])
})

test('correcting count with an unchanged interview status saves without a popup', async ({ page }) => {
  await setupAuthed(page)
  await page.goto('/applications/app-3/edit')
  await page.getByLabel('Interviews', { exact: true }).fill('4')
  const request = page.waitForRequest(r => r.method() === 'PUT' && r.url().endsWith('/applications/app-3'))
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  expect((await request).postDataJSON().interviewCount).toBe(4)
  await expect(page).toHaveURL(/\/applications$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('new application confirms a completed interview before saving', async ({ page }) => {
  await setupAuthed(page)
  await page.goto('/applications/new')
  await page.getByLabel('Vacancy Name *', { exact: true }).fill('Interview test')
  await page.getByLabel('Application Date', { exact: true }).fill('2026-01-01')
  await page.getByLabel('Status', { exact: true }).selectOption('Pending HR Response')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  const request = page.waitForRequest(r => r.method() === 'POST' && r.url().endsWith('/applications'))
  await page.getByRole('button', { name: 'Yes, add interview' }).click()
  expect((await request).postDataJSON().interviewCount).toBe(1)
  await expect(page).toHaveURL(/\/applications$/)
})
