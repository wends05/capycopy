import { test, expect } from "@playwright/test"
import login from "./utils/login"

test.describe("Navigation Tests", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, "Test User")
    await expect(page).toHaveURL(/home/)
  })

  test("header navigation links work correctly", async ({ page }) => {

    const navLinks = ["Home", "About", "Tracker", "Settings"]

    for (const link of navLinks) {
      
      await page.getByRole("link", { name: link }).click()

      await expect(page).toHaveURL(new RegExp(link.toLowerCase()))

      await expect(page.getByRole("link", { name: link })).toHaveClass(/active/)
    }
  })

  test("category navigation works from home page", async ({ page }) => {
 
    await expect(page.locator("[data-testid^='category-']")).toHaveCount(4)

    const categories = [
      { selector: "[data-testid='category-Bills']", expectedUrl: "bills", expectedTitle: "Bills" },
      {
        selector: "[data-testid='category-Food_Drinks']",
        expectedUrl: "food_and_drinks",
        expectedTitle: "Food And Drinks",
      },
      { selector: "[data-testid='category-Lifestyle']", expectedUrl: "lifestyle", expectedTitle: "Lifestyle" },
      {
        selector: "[data-testid='category-Transportation']",
        expectedUrl: "transportation",
        expectedTitle: "Transportation",
      },
    ]

    for (const category of categories) {
      await page.goto("/capycopy/home")
      await expect(page).toHaveURL(/home/)

      await page.locator(category.selector).click()

      await expect(page).toHaveURL(new RegExp(category.expectedUrl))
      await expect(page.locator("h1")).toHaveText(category.expectedTitle)

      await expect(page.locator("nav").first()).toBeVisible()
    }
  })

  test("mobile category navigation menu works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/capycopy/category/bills")

    const categoryButton = page.getByRole("button", { name: "Categories" })
    await expect(categoryButton).toBeVisible()

    await categoryButton.click()

    const closeButton = page.getByRole("button", { name: "Close" })
    await expect(closeButton).toBeVisible()

    await page.getByRole("link", { name: "Transportation" }).click()

    await expect(page).toHaveURL(/transportation/)
    await expect(page.locator("h1")).toHaveText("Transportation")
  })

  test("footer is visible on all pages", async ({ page }) => {
    const routes = [
      "/capycopy/home",
      "/capycopy/about",
      "/capycopy/tracker",
      "/capycopy/settings",
      "/capycopy/category/bills",
    ]

    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator("div").filter({ hasText: "Created with" }).first()).toBeVisible()
    }
  })
})
