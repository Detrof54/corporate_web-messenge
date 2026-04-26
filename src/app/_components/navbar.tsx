import { type Session } from "next-auth";
import Link from "next/link";

export async function Navbar({ session }: { session: Session }) {
  return (
    <div className="navbar bg-gray-800">
      <Link href="/" className="btn bg-gray-900 text-white mr-2">
        Все чаты
      </Link>
  
      <Link href={`/folder/${folder_id}`} className="btn bg-gray-900 text-white mr-2">
        Папка {}
      </Link>


      <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Уведомления
      </Link>
      <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Настройки
      </Link>
      {/* <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Профиль
      </Link> */}

      <Link href="/api/auth/signout" className="btn bg-gray-900 text-white mr-2">
        {session.user?.name}
        Выход
      </Link>
    </div>
  );
}