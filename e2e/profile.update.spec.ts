import { test, expect } from "@playwright/test";

test("пользователь может обновить профиль", async ({ page }) => {
  await page.goto(
    "http://localhost:3000/api/auth/callback/nodemailer?callbackUrl=http%3A%2F%2Flocalhost%3A3000"
  );

  await page.goto("http://localhost:3000/profile/user1");

  await page.getByRole("button", { name: "Редактировать профиль" }).click();

  await expect(
    page.getByText("Редактирование профиля")
  ).toBeVisible();

  await page.getByPlaceholder("Польх").fill("НовоеИмя");
  await page.getByPlaceholder("Фамилия").fill("НоваяФамилия");

  await page.getByRole("button", { name: "Сохранить" }).click();

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("НовоеИмя НоваяФамилия")).toBeVisible();
});