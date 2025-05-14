import { test, expect } from "@playwright/test"

test.describe("Budget Management", () => {
  test.beforeEach(async ({ page }) => {
   
    await page.addInitScript(() => {
      localStorage.setItem("Name", JSON.stringify("Budget Tester"))
      localStorage.setItem("Items", JSON.stringify({}))
    })
    await page.goto("/capycopy/home")
  })

  test("budget progress calculation works correctly", async ({ page }) => {
    
    await page.goto("/capycopy/category/lifestyle")
    await page.locator("[data-testid=budget-input]").fill("100")


    await page.locator("[data-testid=form-item-name]").fill("Gym")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("50")
    await page.locator("[data-testid=form-item-submit]").click()

    
    await page.locator("[data-testid=form-item-name]").fill("Movies")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("25")
    await page.locator("[data-testid=form-item-submit]").click()

    await expect(page.locator("p:has-text('Total:')")).toHaveText("Total: 75")
    await expect(page.locator("p:has-text('Difference:')")).toHaveText("Difference: 25")
  })

  test("exceeding budget updates difference correctly", async ({ page }) => {
    await page.goto("/capycopy/category/transportation")
    await page.locator("[data-testid=budget-input]").fill("50")

    await page.locator("[data-testid=form-item-name]").fill("Gas")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("60")
    await page.locator("[data-testid=form-item-submit]").click()

    await expect(page.locator("p:has-text('Total:')")).toHaveText("Total: 60")
    await expect(page.locator("p:has-text('Difference:')")).toHaveText("Difference: -10")
  })
})
