import { expect, test } from "@playwright/test";
import createItem from "./utils/createItem";
const categories = [
  { name: "Bills", displayName: "Bills", url: "/bills" },
  {
    name: "Food_Drinks",
    displayName: "Food / Drinks",
    url: "/food_and_drinks",
  },
  { name: "Lifestyle", displayName: "Lifestyle", url: "/lifestyle" },
  {
    name: "Transportation",
    displayName: "Transportation",
    url: "/transportation",
  },
];
test.describe("Category", () => {
  test.beforeEach("Set the name and go to the Home Page", async ({ page }) => {
    await page.addInitScript(
      (item) => {
        window.localStorage.setItem(item.key, item.value);
      },
      { key: "Name", value: JSON.stringify("John Doe") }
    );
    await page.goto("/capycopy/home");
    await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);
  });
  test.describe("When I go to the Home Page", () => {
    test("should be able to see all four categories", async ({ page }) => {
      // should be on the home page
      await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

      // check for all categories
      for (const category of categories) {
        const categoryButton = page.locator(
          `[data-testid=category-${category.name}]`
        );
        await expect(categoryButton).toBeVisible();
        await expect(categoryButton).toHaveText(category.displayName);
      }
    });

    test("should be able to click on a category, go to the category page, and display the correct information", async ({
      page,
    }) => {
      // should be on the home page
      await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

      for (const category of categories) {
        const categoryButton = page.locator(
          `[data-testid=category-${category.name}]`
        );
        await expect(categoryButton).toBeVisible();
        await expect(categoryButton).toHaveText(category.displayName);

        // click on the category button
        await categoryButton.click();

        // check if the url is correct
        await expect(page).toHaveURL(/category/);
        await expect(page).toHaveURL(/capycopy/);
        expect(page.url()).toContain(category.url);

        // check if the category name is correct and is visible
        const categoryName = page.locator("h1");
        await expect(categoryName).toBeVisible();
        await expect(categoryName).toHaveText(
          // used for the food and drinks category
          category.displayName.replace(" / ", " And ")
        );

        // should render the navbar
        await expect(page.locator("nav[data-testid=header]")).toBeVisible();

        // current category should be different from the other categories
        await expect(
          page.getByRole("link", {
            name: category.displayName,
          })
        ).toHaveClass(/active/);

        // go back to the home page
        await page.goBack();
        await expect(page).toHaveURL(/home/);
      }

      // check if the url is correct
      await expect(page).toHaveURL(/capycopy/);
      await expect(page).toHaveURL(/home/);
      await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);
    });
  });

  test.describe("When I go to the Transportation Category", () => {
    test.beforeEach("Go to the Transportation Category", async ({ page }) => {
      // should be on the home page
      await expect(page.locator("h1")).toHaveText(/Hello, John Doe!/);

      const categoryButton = page.locator(
        `[data-testid=category-Transportation]`
      );
      await expect(categoryButton).toBeVisible();
      await categoryButton.click();

      // check if the url is correct
      await expect(page).toHaveURL(/capycopy\/category\/transportation/);
    });
    test("should be able to see the budget field", async ({ page }) => {
      // should be on the transportation category page
      await expect(page.locator("h1")).toHaveText(/Transportation/);
      await expect(page.locator("h1")).toBeVisible();

      // check if the url is correct
      await expect(page).toHaveURL(/capycopy\/category\/transportation/);

      // should have a budget input field
      const budget = page.locator("div[data-testid=budget]");
      await expect(budget).toBeVisible();
      await expect(budget).toHaveText(/Budget:/);
      const budgetInput = page.locator("input[data-testid=budget-input]");
      await expect(budgetInput).toBeVisible();
      await expect(budgetInput).toHaveValue("1");
    });

    test.describe("When I change the budget", () => {
      test.beforeEach("Change the value of the budget", async ({ page }) => {
        // should be on the transportation category page
        await expect(page.locator("h1")).toHaveText(/Transportation/);
        await expect(page.locator("h1")).toBeVisible();

        // check if the url is correct
        await expect(page).toHaveURL(/capycopy\/category\/transportation/);
        // should have a budget input field
        const budget = page.locator("div[data-testid=budget]");
        await expect(budget).toBeVisible();
        await expect(budget).toHaveText(/Budget:/);
        const budgetInput = page.locator("input[data-testid=budget-input]");
        await expect(budgetInput).toBeVisible();
        await expect(budgetInput).toHaveValue("1");
        const total = page.locator("p:has-text('Total:')");
        const difference = page.locator("p:has-text('Difference:')");

        await expect(total).toHaveText(/Total: 0/);
        await expect(difference).toHaveText(/Difference: 1/);
        // change the budget value
        await budgetInput.fill("100");
        await expect(budgetInput).toHaveValue("100");
        await expect(total).toHaveText(/Total: 0/);
        await expect(difference).toHaveText(/Difference: 100/);
      });

      test.describe("With Items", () => {
        test.describe("When I add an item", () => {
          test.beforeEach("Add an item", async ({ page }) => {
            await page
              .locator("[data-testid=form-item-name]")
              .fill("Test Item");
            await page.locator("[data-testid=form-item-quantity]").fill("2");
            await page.locator("[data-testid=form-item-amount]").fill("30");

            await expect(
              page.locator("[data-testid=form-item-total]")
            ).toHaveValue("60");
            const submitButton = page.locator("button[type=submit]");
            await expect(submitButton).toBeVisible();
            await submitButton.click();
          });
          test("should update the total and difference value", async ({
            page,
          }) => {
            // test that the budget is 100
            const budgetInput = page.locator("input[data-testid=budget-input]");
            await expect(budgetInput).toBeVisible();
            await expect(budgetInput).toHaveValue("100");

            // test that the total is 60
            const total = page.locator("p:has-text('Total:')");
            await expect(total).toBeVisible();
            await expect(total).toHaveText(/Total: 60/);
            // test that the difference is 40
            const difference = page.locator("p:has-text('Difference:')");
            await expect(difference).toBeVisible();
            await expect(difference).toHaveText(/Difference: 40/);
          });
        });
        test.describe("When I add multiple items", () => {
          test.beforeEach("Add multiple items", async ({ page }) => {
            await createItem(page, "Test Item 1", 2, 30, 60);
            await createItem(page, "Test Item 2", 3, 20, 60);
          });
          test("should update the total and difference value", async ({
            page,
          }) => {
            // test that the budget is 100
            const budgetInput = page.locator("input[data-testid=budget-input]");
            await expect(budgetInput).toBeVisible();
            await expect(budgetInput).toHaveValue("100");

            // test that the total is 120
            const total = page.locator("p:has-text('Total:')");
            await expect(total).toBeVisible();
            await expect(total).toHaveText(/Total: 120/);
            // test that the difference is -20
            const difference = page.locator("p:has-text('Difference:')");
            await expect(difference).toBeVisible();
            await expect(difference).toHaveText(/Difference: -20/);
          });
          test("should show the items added", async ({ page }) => {
            const item1 = page.locator("[data-testid=item]").first();
            const item2 = page.locator("[data-testid=item]").nth(1);
            await expect(item1).toBeVisible();
            await expect(item2).toBeVisible();
          });
        });
        test.describe("When I edit an item", () => {
          test.beforeEach("Create an item", async ({ page }) => {
            await createItem(page, "Test Item 1", 2, 30, 60);
            await createItem(page, "Test Item 2", 3, 20, 60);
          });
          test("should update the total and difference value based if item amount increased", async ({
            page,
          }) => {
            const item1 = page.locator("[data-testid=item]").first();
            await expect(item1).toBeVisible();
            await item1.locator("button[data-testid=edit-item]").click();
            await item1
              .locator("[data-testid=item-amount]")
              .fill("40");
            await item1.locator("button[type=submit]").click();

            // test that the total is 140
            const total = page.locator("p:has-text('Total:')");
            await expect(total).toBeVisible();
            await expect(total).toHaveText(/Total: 140/);
            // test that the difference is -40
            const difference = page.locator("p:has-text('Difference:')");
            await expect(difference).toBeVisible();
            await expect(difference).toHaveText(/Difference: -40/);
            
            // test that the item total is 80
            const itemTotal = item1.locator("[data-testid=item-total]");
            await expect(itemTotal).toBeVisible();
            await expect(itemTotal).toHaveValue("80");
            // test that the item amount is 40
            const itemAmount = item1.locator("[data-testid=item-amount]");
            await expect(itemAmount).toBeVisible();
            await expect(itemAmount).toHaveValue("40");
            // test that the item quantity is 2
            const itemQuantity = item1.locator("[data-testid=item-quantity]");
            await expect(itemQuantity).toBeVisible(); 
          });

          test("should update the total and difference value based if item amount decreased", async ({
            page,
          }) => {});

          test("should update the total and difference value based if item quantity increased", async ({
            page,
          }) => {});
          test("should update the total and difference value based if item quantity decreased", async ({
            page,
          }) => {});
        });
        test.describe("When I delete an item", () => {
          test("should update the total and difference value based on the new item", async ({
            page,
          }) => {});
        });
      });
    });
  });
});
