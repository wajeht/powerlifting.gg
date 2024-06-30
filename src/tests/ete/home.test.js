import { test, expect } from '@playwright/test';

test.describe('when visiting to / route', () => {
	test('should be able to see expected description', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: "Let's Find Your Perfect Coach" }),
		).toBeVisible();
		await expect(
			page.getByText(
				'Search for the best strength coaches in your area. Read reviews from other clients.',
			),
		).toBeVisible();
	});
});
