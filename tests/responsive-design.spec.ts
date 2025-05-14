import { test, expect } from "@playwright/test"
import login from "./utils/login"

test.describe("Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Responsive Tester")
  })

  test("application is responsive on mobile devices", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/capycopy/home")

    const header = page.locator("nav[data-testid=header]")
    await expect(header).toBeVisible()

    const categoryGrid = page.locator("div.grid.grid-cols-1")
    await expect(categoryGrid).toBeVisible()

    await page.goto("/capycopy/category/bills")

    const mobileNav = page.locator("nav.sm\\:hidden")
    await expect(mobileNav).toBeVisible()

    const desktopNav = page.locator("nav.hidden.sm\\:flex")
    await expect(desktopNav).toBeHidden()

    const addItemForm = page.locator("form.grid-flow-row")
    await expect(addItemForm).toBeVisible()
  })

  test("application is responsive on tablet devices", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto("/capycopy/home")

    const header = page.locator("nav[data-testid=header]")
    await expect(header).toBeVisible()

    const categoryGrid = page.locator("div.sm\\:grid-cols-2")
    await expect(categoryGrid).toBeVisible()

    await page.goto("/capycopy/category/bills")

    const desktopNav = page.locator("nav.hidden.sm\\:flex")
    await expect(desktopNav).toBeVisible()

    const mobileNav = page.locator("nav.sm\\:hidden")
    await expect(mobileNav).toBeHidden()
  })

  test("application is responsive on desktop devices", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    await page.goto("/capycopy/home")

    const header = page.locator("nav[data-testid=header]")
    await expect(header).toBeVisible()

    const categoryGrid = page.locator("div.sm\\:grid-cols-2")
    await expect(categoryGrid).toBeVisible()

    await page.goto("/capycopy/category/bills")

    const desktopNav = page.locator("nav.hidden.sm\\:flex")
    await expect(desktopNav).toBeVisible()

    const mobileNav = page.locator("nav.sm\\:hidden")
    await expect(mobileNav).toBeHidden()

    const addItemForm = page.locator("form.sm\\:grid-flow-col")
    await expect(addItemForm).toBeVisible()
  })
})
