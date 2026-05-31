"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    // проверяем пользователя
    const response = await fetch("/api/auth/check-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await response.json();
    if (!data.exists) {
      setError("У вас нет доступа.");
      return;
    }
    // отправляем magic link
    await signIn("nodemailer", {
      email,
      callbackUrl: "/",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[400px] space-y-4 rounded-xl border p-6">
        <h1 className="text-2xl font-bold">
          Вход
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded border p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}

        <button
            onClick={handleLogin}
            className="
                w-full 
                rounded 
                bg-violet-600 
                p-2 
                text-white
                hover:bg-violet-500
            "
        >
          Войти
        </button>
      </div>
    </div>
  );
}