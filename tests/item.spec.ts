import { test, expect } from "@playwright/test";
import createItem from "./utils/createItem";

test.describe("Item Lifecycle", () => {
  test.describe("Given that I am on the home page", () => {
    test.beforeEach("Set name and go to the home page", async ({ page }) => {
      await page.addInitScript(
        (item) => {
          localStorage.setItem(item.key, item.value);
        },
        {
          key: "Name",
          value: JSON.stringify("John Doe"),
        }
      );
      await page.goto("/capycopy/home");
      await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);
      
    });
    test.describe("When I go to the Bills Page", () => {
      test.beforeEach("Go to the Bills Page", async ({ page }) => {
        // assuming the person is inside the home page
        // with the name "John Doe"
        await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

        const billsButton = page.locator("[data-testid=category-Bills]");
        await expect(billsButton).toBeVisible();
        await billsButton.click();

        // bills page
        await expect(page).toHaveURL(/capycopy\/category\/bills/);
      });

      test("should be able to create an item", async ({ page }) => {
        // should be on the bills page
        await createItem(page, "Test Item", 2, 20, 40);
        // expect that the item is created below

        // name
        const item = page.locator("[data-testid=item-name]");
        await expect(item).toBeVisible();
        await expect(item).toHaveValue(/Test Item/);

        // quantity
        await expect(
          page.locator("input[data-testid=item-quantity]")
        ).toHaveValue(/2/);

        // amount
        await expect(
          page.locator("input[data-testid=item-amount]")
        ).toHaveValue(/20/);

        // total
        await expect(page.locator("input[data-testid=item-total]")).toHaveValue(
          /40/
        );
      });

      test.describe("and when i edit the item", () => {
        test.beforeEach("Create an Item", async ({ page }) => {
          // should be on the bills page
          // create an item first

          await createItem(page, "Test Item", 2, 20, 40);
        });
        test("should be able to edit the item", async ({ page }) => {
          const itemName = page.locator("[data-testid=item-name]");
          const itemQuantity = page.locator("[data-testid=item-quantity]");
          const itemAmount = page.locator("[data-testid=item-amount]");
          const itemTotal = page.locator("[data-testid=item-total]");

          await expect(itemName).toBeVisible();
          await expect(itemQuantity).toBeVisible();
          await expect(itemAmount).toBeVisible();
          await expect(itemTotal).toBeVisible();

          // editing the item
          const editButton = page.locator("[data-testid=edit-item]");
          await expect(editButton).toBeVisible();
          await editButton.click();

          // all inputs should be editable now
          await expect(itemName).toBeEditable();
          await expect(itemQuantity).toBeEditable();
          await expect(itemAmount).toBeEditable();
          await expect(itemTotal).not.toBeEditable();

          // changing the values
          await itemName.fill("Test Item 2");
          await itemQuantity.fill("3");
          await itemAmount.fill("30");
          await expect(itemTotal).toHaveValue("90");

          // submit the changes
          const submitButton = page.locator(
            "button[type=submit][data-testid=confirm-changes]"
          );
          await expect(submitButton).toBeVisible();
          await submitButton.click();
          await expect(itemName).toHaveValue("Test Item 2");
          await expect(itemQuantity).toHaveValue("3");
          await expect(itemAmount).toHaveValue("30");
          await expect(itemTotal).toHaveValue("90");
        });

        test("should be able to cancel edits", async ({ page }) => {
          const itemName = page.locator("[data-testid=item-name]");
          const itemQuantity = page.locator("[data-testid=item-quantity]");
          const itemAmount = page.locator("[data-testid=item-amount]");
          const itemTotal = page.locator("[data-testid=item-total]");

          await expect(itemName).toBeVisible();
          await expect(itemQuantity).toBeVisible();
          await expect(itemAmount).toBeVisible();
          await expect(itemTotal).toBeVisible();

          // editing the item
          // editing the item
          const editButton = page.locator("[data-testid=edit-item]");
          await expect(editButton).toBeVisible();
          await editButton.click();

          // all inputs should be editable now
          await expect(itemName).toBeEditable();
          await expect(itemQuantity).toBeEditable();
          await expect(itemAmount).toBeEditable();
          await expect(itemTotal).not.toBeEditable();

          // changing the values
          await itemName.fill("Test Item 2");
          await itemQuantity.fill("3");
          await itemAmount.fill("100");
          await expect(itemTotal).toHaveValue("300");

          // cancel the changes

          await page.locator("button[type=reset]").click();
          await expect(itemName).toHaveValue("Test Item");
          await expect(itemQuantity).toHaveValue("2");
          await expect(itemAmount).toHaveValue("20");
          await expect(itemTotal).toHaveValue("40");
        });
      });

      test("should be able to delete the item", async ({ page }) => {
        // should be on the bills page
        // create an item first

        await expect(
          page.locator("[data-testid=form-item-name]")
        ).toBeVisible();
        await page.locator("[data-testid=form-item-name]").fill("Test Item");
        await page.locator("[data-testid=form-item-quantity]").fill("2");
        await page.locator("[data-testid=form-item-amount]").fill("20");

        await expect(page.locator("[data-testid=form-item-total]")).toHaveValue(
          "40"
        );
        page.locator("button[data-testid=form-item-submit]").click();

        // item should be created below

        const item = page.locator("[data-testid=item]");
        await expect(item).toBeVisible();

        // delete the item
        await page.locator("button[data-testid=delete-item]").click();
        await expect(item).not.toBeVisible();
        // expect that the item is deleted
        await expect(page.locator("[data-testid=item]")).not.toBeVisible();
        await expect(page.locator("[data-testid=item-name]")).not.toBeVisible();
        await expect(
          page.locator("[data-testid=item-quantity]")
        ).not.toBeVisible();
        await expect(
          page.locator("[data-testid=item-amount]")
        ).not.toBeVisible();
        await expect(
          page.locator("[data-testid=item-total]")
        ).not.toBeVisible();
      });
    });
  });
});
