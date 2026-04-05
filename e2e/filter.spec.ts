import { test, expect } from "@playwright/test";

const MOCK_LISTINGS = {
  items: [],
  _links: { self: {}, first: {}, last: {} },
  _meta: { totalCount: 0, pageCount: 1, currentPage: 1, perPage: 20 },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/properties-mock**", (route) =>
    route.fulfill({ json: MOCK_LISTINGS }),
  );
  await page.route("**/api/locations**", (route) =>
    route.fulfill({ json: [] }),
  );
});

test.describe("Filter flow", () => {
  test("opening the filter modal, setting a min price, and applying updates the URL", async ({
    page,
  }) => {
    await page.goto("/");

    // Open the filter modal
    await page.getByRole("button", { name: /filter/i }).click();

    // Fill in the min price field
    const minPriceInput = page.getByTestId("min-price-input").locator("input");
    await minPriceInput.fill("1000");

    // Apply the filters
    await page.getByRole("button", { name: /apply filters/i }).click();

    await expect(page).toHaveURL(/minPrice=1000/);
  });

  test("submitting minPrice greater than maxPrice shows a validation error", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /filter/i }).click();

    const minPriceInput = page.getByTestId("min-price-input").locator("input");
    const maxPriceInput = page.getByTestId("max-price-input").locator("input");
    await minPriceInput.fill("5000");
    await maxPriceInput.fill("1000");

    await page.getByRole("button", { name: /apply filters/i }).click();

    // The zod refinement error should surface
    await expect(
      page.getByText(/minimum price must be less than maximum price/i),
    ).toBeVisible();

    // URL must NOT have changed
    await expect(page).not.toHaveURL(/minPrice/);
  });

  test("clearing filters removes filter params while keeping other params", async ({
    page,
  }) => {
    // Start with an active filter
    await page.goto("/?minPrice=1000&section=rent");

    await page.getByRole("button", { name: /filter/i }).click();

    await page.getByRole("button", { name: /clear/i }).click();

    // minPrice should be gone, section should remain
    await expect(page).not.toHaveURL(/minPrice/);
    await expect(page).toHaveURL(/section=rent/);
  });

  test("switching between Rent and Sale updates the section param", async ({
    page,
  }) => {
    await page.goto("/");

    // The PropertySectionSelector typically shows Rent / Sale toggle buttons
    await page.getByRole("button", { name: /rent/i }).click();

    await expect(page).toHaveURL(/section=rent/);
  });
});
