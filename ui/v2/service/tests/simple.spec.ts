import { test, expect } from '@playwright/test'

test('Has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Evidently/)
})

test('Altering project title and description', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Project List')).toBeVisible()

  await page.getByRole('link', { name: 'Demo project - Reviews' }).hover()

  // edit button
  await page
    .locator('#root')
    .filter({
      hasText:
        'A toy demo project using E-commerce Reviews dataset. Text and tabular data, classification.'
    })
    .getByRole('button')
    .click()

  await page.locator('input[name="name"]').fill('Reviews new title')
  await page.locator('input[name="description"]').fill('Reviews new description')

  await page.getByText('Save').click()

  await page.waitForLoadState('domcontentloaded')

  await expect(page.getByText('Reviews new description')).toBeVisible()
  await expect(page.getByText('Reviews new title')).toBeVisible()

  await page.getByRole('link', { name: 'Reviews new' }).click()

  await page.waitForLoadState('domcontentloaded')

  await expect(page.getByText('Dashboard')).toBeVisible()
})

test('Navigation test', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Demo project - Bikes' }).click()
  await page.getByText('Bike Rental Demand Forecast').click()
  await page.getByRole('tab', { name: 'Reports' }).click()

  await page.getByRole('button', { name: 'production_critical' }).first().click()
  await expect(page.getByRole('columnheader', { name: 'Report ID' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Tags' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  await page.getByRole('button', { name: 'View' }).first().click()
  await expect(page.getByText('Dataset Drift', { exact: true })).toBeVisible()

  await page.getByRole('tab', { name: 'Test suites' }).click()

  await expect(page.getByRole('columnheader', { name: 'Test Suite ID' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Tags' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  await page.getByRole('button', { name: 'View' }).first().click()
  await expect(page.getByText('Drift per Column', { exact: true }).first()).toBeVisible()
})

test('Download reports and test suites test', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Demo project - Bikes' }).click()

  await page.waitForLoadState('domcontentloaded')

  for (const tab of ['Reports', 'Test Suite']) {
    await page.getByRole('tab', { name: tab }).click()

    await page.waitForLoadState('domcontentloaded')

    for (const downloadType of ['Download HTML', 'Download JSON']) {
      await page.getByText('Download').first().click()

      const page1Promise = page.waitForEvent('popup')
      const downloadPromise = page.waitForEvent('download')

      await page.getByRole('menuitem', { name: downloadType }).click()

      const [_, download] = await Promise.all([page1Promise, downloadPromise])

      expect(await download.failure()).toBeNull()
    }
  }
})
