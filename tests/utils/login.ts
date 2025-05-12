import { expect, Page } from "@playwright/test";
const login = async (page: Page, name: string) => {
  page.goto("/");

  await expect(page).toHaveURL(/capycopy/);

  const usernameInput = page.locator("[data-testid=username]");
  await expect(usernameInput).toBeVisible();
  usernameInput.fill(name);

  const submitButton = page.locator("button[type=submit]");
  await expect(submitButton).toBeVisible();
  await submitButton.click();

  // loading page
  await expect(page).toHaveURL(/loading/);
  await page.waitForTimeout(2000);
};
export default login;
