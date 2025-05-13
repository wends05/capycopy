import { test, expect } from "@playwright/test";
import login from "./utils/login";

test.describe("Entering the website", () => {
  test("should know my name when entering the dashboard page", async ({
    page,
  }) => {
    // relocate to start page when going to the root page
    page.goto("/");

    await expect(page).toHaveURL(/capycopy/);

    // enter name in the input field
    const usernameInput = page.locator("[data-testid=username]");
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill("John Doe");

    const submitButton = page.locator("button[type=submit]");
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // loading page

    await expect(page).toHaveURL(/loading/);
    await page.waitForTimeout(2000);

    // redirect to home page
    await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);
  });

  test("settings page should know my name", async ({ page }) => {
    // input name first
    await login(page, "John Doe");
    await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

    // go to the settings page
    await page.goto("/capycopy/settings");
    await expect(page).toHaveURL(/settings/);

    // check for input field. Input field should be filled with the current name
    // in this case, "John Doe"
    const settingsInput = page.locator("[data-testid=username]");
    await expect(settingsInput).toBeVisible();
    expect(settingsInput).toHaveValue("John Doe");
  });

  test("Changing name in settings should update the name in home page", async ({
    page,
  }) => {
    // setup the person
    await login(page, "Initial Name");

    // go to the settings page
    // check for input field. Input field should be filled with the current name
    await page.goto("/capycopy/settings");

    const settingsInput = page.locator("[data-testid=username]");
    await expect(settingsInput).toBeVisible();
    expect(settingsInput).toHaveValue("Initial Name");

    // change the name
    await settingsInput.fill("Jane Doe");
    const submitButtonSettings = page.locator("input[type=submit]");
    await expect(submitButtonSettings).toBeVisible();
    await submitButtonSettings.click();

    // should reflect name on the home page
    await page.goto("/capycopy/home");
    await expect(page.locator("h1")).toHaveText(/Hello, Jane Doe!/);
  });

  test("Empty name input on root page should be allowed", async ({ page }) => {
    // relocate to start page when going to the root page
    await login(page, "");

    // redirect to home page
    await expect(page.locator("h1")).toHaveText(/Hello!/);
  });

  test("Empty name can be set in settings page", async ({ page }) => {
    // relocate to start page when going to the root page
    await login(page, "John Doe");

    // home page
    await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

    // go to the settings page
    await page.goto("/capycopy/settings");
    await expect(page).toHaveURL(/settings/);

    // check for input field. Input field should be filled with the current name
    // in this case, "John Doe"
    const settingsInput = page.locator("[data-testid=username]");
    await expect(settingsInput).toBeVisible();
    expect(settingsInput).toHaveValue("John Doe");

    // change the name
    await settingsInput.fill("");
    const submitButtonSettings = page.locator("input[type=submit]");
    await expect(submitButtonSettings).toBeVisible();
    await submitButtonSettings.click();

    // should reflect name on the home page
    await page.goto("/capycopy/home");
    await expect(page.locator("h1")).toHaveText(/Hello!/);
  });

  test("Local storage should be updated when changing name", async ({
    page,
  }) => {
    // relocate to start page when going to the root page
    await login(page, "John Doe");

    // go to the settings page
    await page.goto("/capycopy/settings");
    await expect(page).toHaveURL(/settings/);

    // check for input field. Input field should be filled with the current name
    // in this case, "John Doe"
    const settingsInput = page.locator("[data-testid=username]");
    await expect(settingsInput).toBeVisible();
    expect(settingsInput).toHaveValue("John Doe");

    // change the name
    await settingsInput.fill("Jane Doe");
    const submitButtonSettings = page.locator("input[type=submit]");
    await expect(submitButtonSettings).toBeVisible();
    await submitButtonSettings.click();

    // should reflect name on the home page
    await page.goto("/capycopy/home");
    await expect(page.locator("h1")).toHaveText(/Hello, Jane Doe!/);

    // check local storage
    const name = JSON.parse(
      (await page.evaluate(() => localStorage.getItem("Name"))) as string
    );
    expect(name).toBe("Jane Doe");
  });

  test("Local storage data should be the same as the name when entering the home page", async ({
    page,
  }) => {
    // relocate to start page when going to the root page
    await login(page, "John Doe");

    // redirect to home page
    await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

    // check local storage
    const name = JSON.parse(
      (await page.evaluate(() => localStorage.getItem("Name"))) as string
    );
    expect(name).toBe("John Doe");
  });
});
