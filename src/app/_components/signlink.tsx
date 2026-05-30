import Link from "next/link";

export function SigninLink() {
  return (
    <Link href="/api/auth/signin" className="
        bg-purple-700
        text-white
        px-4
        py-2
        rounded-lg
        font-medium
        transition-colors
        duration-300
        hover:bg-purple-500
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
        focus:ring-offset-2">
      Войти в профиль
    </Link>
  );
}