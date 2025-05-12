import { expect, Page } from "@playwright/test";

const createItem = async (
  page: Page,
  name: string,
  quantity: number,
  amount: number,
  total: number
) => {
  expect(page.locator("[data-testid=form-item-name]")).toBeVisible();
  await page.locator("[data-testid=form-item-name]").fill(name);
  await page.locator("[data-testid=form-item-quantity]").fill(quantity.toString());
  await page.locator("[data-testid=form-item-amount]").fill(amount.toString());

  await expect(page.locator("[data-testid=form-item-total]")).toHaveValue(total.toString());
  await page.locator("button[data-testid=form-item-submit]").click();

  // item should be created below

  const item = page.locator("[data-testid=item]");
  await expect(item).toBeVisible();
};

export default createItem;
