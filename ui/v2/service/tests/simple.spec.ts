import { test, expect } from '@playwright/test'

test('Has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Evidently/)
})

test('Altering project title and description', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Project List')).toBeVisible()

  await page.getByRole('link', { name: 'Demo project - Reviews' }).hover()

  await page
    .locator('#root div')
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

  await page.getByRole('link', { name: 'Reviews new' }).click()

  await page.waitForLoadState('domcontentloaded')

  await expect(page.getByText('Dashboard')).toBeVisible()
})
