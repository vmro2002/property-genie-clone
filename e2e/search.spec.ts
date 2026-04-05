import { test, expect } from "@playwright/test";

/**
 * Mock the listings API so the E2E tests are not coupled to the external service.
 * These tests only care about search/navigation behaviour, not the listing data itself.
 */
const MOCK_LISTINGS = {
  items: [],
  _links: { self: {}, first: {}, last: {} },
  _meta: { totalCount: 0, pageCount: 1, currentPage: 1, perPage: 20 },
};

const MOCK_LOCATIONS = [
  { type: "State", title: "Selangor", slug: "selangor" },
  { type: "City", title: "Kuala Lumpur", slug: "kuala-lumpur" },
];

test.beforeEach(async ({ page }) => {
  // Intercept the properties API (called in getServerSideProps)
  await page.route("**/api/properties-mock**", (route) =>
    route.fulfill({ json: MOCK_LISTINGS }),
  );
  // Intercept the locations API (called client-side through /api/locations)
  await page.route("**/api/locations**", (route) =>
    route.fulfill({ json: MOCK_LOCATIONS }),
  );
});

test.describe("Search flow", () => {
  test("submitting a keyword updates the URL and shows a breadcrumb", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByRole("textbox").first();
    await searchInput.fill("KLCC");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(/q=KLCC/);
    await expect(page.getByText(/search results for "KLCC"/i)).toBeVisible();
  });

  test("clicking a State suggestion navigates to ?state=... URL", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByRole("textbox").first();
    await searchInput.fill("Sel");

    // Wait for the dropdown to appear
    await expect(page.getByText(/^Selangor$/)).toBeVisible();
    await page.getByText(/^Selangor$/).click();

    await expect(page).toHaveURL(/state=Selangor/);
  });

  test("clicking a City suggestion navigates to ?city=... URL", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByRole("textbox").first();
    await searchInput.fill("Kual");

    await expect(page.getByText(/^Kuala Lumpur$/)).toBeVisible();
    await page.getByText(/^Kuala Lumpur$/).click();

    await expect(page).toHaveURL(/city=Kuala\+Lumpur/);
  });
});
