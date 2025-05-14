import { test, expect } from "@playwright/test"

test.describe("Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("Name", JSON.stringify("Error Tester"))
    })
  })

  test("error page contains expected elements", async ({ page }) => {
    await page.goto("/capycopy/non-existent-page")

    await page.waitForTimeout(1000)

    const pageContent = await page.textContent("body")
    expect(pageContent).toContain("Unexpected Application Error!")
    expect(pageContent).toContain("404 Not Found")
    expect(pageContent).toContain("Hey developer 👋")
  })

  test("form validation - empty item name", async ({ page }) => {
    await page.goto("/capycopy/category/bills")

    await page.locator("[data-testid=form-item-name]").fill("")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("10")
    await page.locator("[data-testid=form-item-submit]").click()

    const itemsAfterSubmit = await page.locator("[data-testid=item]").count()
    expect(itemsAfterSubmit).toBe(0)
  })

  test("form calculation - total updates correctly", async ({ page }) => {
    await page.goto("/capycopy/category/bills")

    await page.locator("[data-testid=form-item-name]").fill("Test Item")
    await page.locator("[data-testid=form-item-quantity]").fill("2")
    await page.locator("[data-testid=form-item-amount]").fill("15")

    const totalValue = await page.locator("[data-testid=form-item-total]").inputValue()
    expect(Number(totalValue)).toBe(30)
  })

  test("form reset after submission", async ({ page }) => {
    await page.goto("/capycopy/category/bills")

    await page.locator("[data-testid=form-item-name]").fill("Test Item")
    await page.locator("[data-testid=form-item-quantity]").fill("2")
    await page.locator("[data-testid=form-item-amount]").fill("15")
    await page.locator("[data-testid=form-item-submit]").click()

    const nameValue = await page.locator("[data-testid=form-item-name]").inputValue()
    const quantityValue = await page.locator("[data-testid=form-item-quantity]").inputValue()
    const amountValue = await page.locator("[data-testid=form-item-amount]").inputValue()

    expect(nameValue).toBe("")
    expect(quantityValue).toBe("1")
    expect(amountValue).toBe("1")
  })

  test("cancel edit operation", async ({ page }) => {
    await page.goto("/capycopy/category/bills")

    await page.locator("[data-testid=form-item-name]").fill("Test Item")
    await page.locator("[data-testid=form-item-quantity]").fill("2")
    await page.locator("[data-testid=form-item-amount]").fill("15")
    await page.locator("[data-testid=form-item-submit]").click()

    await page.locator("[data-testid=edit-item]").click()

    await page.locator("[data-testid=item-name]").fill("Changed Name")
    await page.locator("[data-testid=item-quantity]").fill("3")
    await page.locator("[data-testid=item-amount]").fill("20")

    await page.locator("button[type=reset]").click()

    const nameValue = await page.locator("[data-testid=item-name]").inputValue()
    const quantityValue = await page.locator("[data-testid=item-quantity]").inputValue()
    const amountValue = await page.locator("[data-testid=item-amount]").inputValue()

    expect(nameValue).toBe("Test Item")
    expect(quantityValue).toBe("2")
    expect(amountValue).toBe("15")
  })
})
