import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-gray-800">
      <Link href="/" className="btn bg-gray-900 text-white mr-2">
        Домой
      </Link>
      <Link href="/tournaments" className="btn bg-gray-900 text-white mr-2">
        Турниры
      </Link>
      <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Профиль
      </Link>
      <Link href="/api/auth/signout" className="btn bg-gray-900 text-white mr-2">
        {session.user?.name}
        Выход
      </Link>
    </div>
  );
}