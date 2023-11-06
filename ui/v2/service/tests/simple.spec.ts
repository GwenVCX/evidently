import { test, expect } from '@playwright/test'

test('Has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Evidently/)
})

test('Can view Snapshot', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Demo project - Bikes' }).click()
  await page.getByText('Bike Rental Demand Forecast').click()
  await page.getByRole('tab', { name: 'Reports' }).click()

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

test('Download reports and test suites', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Demo project - Bikes' }).click()

  await page.waitForLoadState('domcontentloaded')

  for (const tab of ['Reports', 'Test Suite']) {
    await page.getByRole('tab', { name: tab }).click()

    await page.waitForLoadState('domcontentloaded')

    for (const downloadType of ['Download HTML', 'Download JSON']) {
      await page.getByText('Download').first().click()

      const downloadPromise = page.waitForEvent('download')

      await page.getByRole('menuitem', { name: downloadType }).click()

      const download = await downloadPromise

      expect(await download.failure()).toBeNull()
    }
  }
})

test('We expect to see at least 3 plotly graphs', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Demo project - Bikes' }).click()
  for (let index = 0; index < 3; index++) {
    await expect(page.locator('.js-plotly-plot').nth(index)).toBeVisible()
  }
})

test('Altering project title and description', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Project List')).toBeVisible()

  await page.getByRole('link', { name: 'Demo project - Reviews' }).hover()

  await page
    .getByText(
      'Demo project - ReviewsA toy demo project using E-commerce Reviews dataset. Text and tabular data, classification.'
    )
    .getByTestId('EditIcon')
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
