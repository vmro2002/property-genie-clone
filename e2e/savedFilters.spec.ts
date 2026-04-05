import { test, expect } from "@playwright/test";

const MOCK_LISTINGS = {
  items: [],
  _links: { self: {}, first: {}, last: {} },
  _meta: { totalCount: 0, pageCount: 1, currentPage: 1, perPage: 20 },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/properties-mock**", (route) =>
    route.fulfill({ json: MOCK_LISTINGS })
  );
  await page.route("**/api/locations**", (route) =>
    route.fulfill({ json: [] })
  );
  // Clear localStorage before each test so saved filters don't bleed between tests
  await page.addInitScript(() => {
    localStorage.removeItem("property-genie-saved-filters");
  });
});

test.describe("Saved filters flow", () => {
  test("applying filters and clicking Save shows a success toast", async ({
    page,
  }) => {
    await page.goto("/?section=rent&minPrice=500");

    await page.getByRole("button", { name: /save/i }).first().click();

    await expect(page.getByText(/saved successfully/i)).toBeVisible();
  });

  test("saving the same filter twice shows the 'already saved' toast", async ({
    page,
  }) => {
    await page.goto("/?section=rent&minPrice=500");

    const saveButton = page.getByRole("button", { name: /^save$/i }).first();

    // First save
    await saveButton.click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Wait for the toast to clear
    await page.waitForTimeout(2500);

    // Second save — same filter
    await saveButton.click();
    await expect(page.getByText(/already saved/i)).toBeVisible();
  });

  test("clicking Save with no filters active shows an info toast", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /^save$/i }).first().click();

    await expect(page.getByText(/no filters to save/i)).toBeVisible();
  });

  test("saved filter appears in the Saved modal and clicking Apply navigates to it", async ({
    page,
  }) => {
    await page.goto("/?state=Selangor&section=rent");

    // Save the filter
    await page.getByRole("button", { name: /^save$/i }).first().click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Open Saved modal
    await page.getByRole("button", { name: /saved/i }).click();

    // The saved filter should appear
    await expect(page.getByText("Rent • Selangor")).toBeVisible();

    // Click to apply it
    await page.getByText("Rent • Selangor").click();

    await expect(page).toHaveURL(/section=rent/);
    await expect(page).toHaveURL(/state=Selangor/);
  });

  test("deleting a saved filter removes it from the modal", async ({
    page,
  }) => {
    await page.goto("/?section=sale&categories=condo");

    await page.getByRole("button", { name: /^save$/i }).first().click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible();

    // Open Saved modal
    await page.getByRole("button", { name: /saved/i }).click();

    // The filter should be listed
    const deleteButton = page.getByLabel(/delete saved search/i);
    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    // After deletion the empty state should appear
    await expect(page.getByText(/no saved searches yet/i)).toBeVisible();
  });
});
