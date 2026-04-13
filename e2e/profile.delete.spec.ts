import { test, expect } from "@playwright/test";

test("пользователь может удалить профиль", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/api/auth/callback/nodemailer?callbackUrl=http%3A%2F%2Flocalhost%3A3000"
  );

  await page.goto("http://localhost:3000/profile/user1");

  await expect(
    page.getByRole("button", { name: "Удалить профиль" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Удалить профиль" }).click();

  await page.waitForLoadState("networkidle");

});
