import { test, expect } from "@playwright/test"

test.describe("Complete User Flow", () => {
  test("full user journey from registration to budget management", async ({ page }) => {
    
    await page.goto("/")
    await expect(page.locator("h1")).toHaveText("Hello!")

    await page.locator("[data-testid=username]").fill("New User")
    await page.getByRole("button", { name: "Enter" }).click()

   
    await expect(page).toHaveURL(/loading/)
    await page.waitForURL(/home/)

   
    await expect(page.locator("h1")).toHaveText("Hello, New User!")
    await expect(page.locator("[data-testid^='category-']")).toHaveCount(4)

  
    await page.getByRole("link", { name: "About" }).click()
    await expect(page).toHaveURL(/about/)
    await expect(page.locator("h1")).toHaveText("About Page")

 
    await page.getByRole("link", { name: "Settings" }).click()
    await expect(page).toHaveURL(/settings/)

    await page.locator("[data-testid=username]").fill("Budget Master")
    await page.getByRole("button", { name: "Set" }).click()

  
    await page.getByRole("link", { name: "Home" }).click()
    await page.locator("[data-testid='category-Bills']").click()

    await expect(page).toHaveURL(/bills/)
    await page.locator("[data-testid=budget-input]").fill("1000")

   
    await page.locator("[data-testid=form-item-name]").fill("Rent")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("700")
    await page.locator("[data-testid=form-item-submit]").click()

    await page.locator("[data-testid=form-item-name]").fill("Utilities")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("150")
    await page.locator("[data-testid=form-item-submit]").click()


    await page.getByRole("link", { name: "Home" }).click()
    await page.locator("[data-testid='category-Food_Drinks']").click()

    await expect(page).toHaveURL(/food_and_drinks/)
    await page.locator("[data-testid=budget-input]").fill("500")

   
    await page.locator("[data-testid=form-item-name]").fill("Groceries")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("300")
    await page.locator("[data-testid=form-item-submit]").click()

    await page.locator("[data-testid=form-item-name]").fill("Dining Out")
    await page.locator("[data-testid=form-item-quantity]").fill("1")
    await page.locator("[data-testid=form-item-amount]").fill("150")
    await page.locator("[data-testid=form-item-submit]").click()

   
    await page.getByRole("link", { name: "Tracker" }).click()
    await expect(page).toHaveURL(/tracker/)


    const totalBudget = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(0).textContent()
    const totalExpenses = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(1).textContent()

    expect(Number(totalBudget)).toBe(1500) 
    expect(Number(totalExpenses)).toBe(1300) 

    await page.getByRole("link", { name: "Bills" }).click()

    const firstItem = page.locator("[data-testid=item]").first()
    await firstItem.locator("[data-testid=edit-item]").click()
    await firstItem.locator("[data-testid=item-amount]").fill("650")
    await firstItem.locator("[data-testid=confirm-changes]").click()


    await expect(page.locator("p:has-text('Total:')")).toHaveText("Total: 800")

    const secondItem = page.locator("[data-testid=item]").nth(1)
    await secondItem.locator("[data-testid=delete-item]").click()

    await expect(page.locator("p:has-text('Total:')")).toHaveText(/Total: 650/)

    await page.getByRole("link", { name: "Tracker" }).click()

    const updatedTotalBudget = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(0).textContent()
    const updatedTotalExpenses = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(1).textContent()

    expect(Number(updatedTotalBudget)).toBe(1500) 
    expect(updatedTotalExpenses).toMatch(/^0?650150450$/) 

    await page.getByRole("link", { name: "Settings" }).click()
    await page.getByRole("link", { name: "Reset Data" }).click()
    await page.getByRole("button", { name: "Reset" }).click()


    await page.waitForURL(/home/)
    await page.getByRole("link", { name: "Tracker" }).click()

    const resetTotalBudget = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(0).textContent()
    const resetTotalExpenses = await page.locator("div.flex.flex-row.items-end.gap-2 p").nth(1).textContent()

    expect(Number(resetTotalBudget)).toBe(0)
    expect(Number(resetTotalExpenses)).toBe(0)
  })
})
