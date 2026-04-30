// "use server";

// import { type Session } from "next-auth";
// import Link from "next/link";
// import { api } from "~/trpc/server";

// //Верхняя панель навигации, сейчас используется другая

// export async function Navbar({ session }: { session: Session }) {

//   const folders = await api.navbar.getListFolders();

//   return (
//     <div className="navbar bg-gray-800">
//       <Link href="/" className="btn bg-gray-900 text-white mr-2">
//         Все
//       </Link>
//       {
//         folders?.folder.map((folder: {id: string, name: string}) => 
//           <Link href={`/folder/${folder.id}`} className="btn bg-gray-900 text-white mr-2">
//             {folder.name}
//           </Link>
//         )
//       }
//       <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
//         Уведомления
//       </Link>
//       <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
//         Настройки
//       </Link>
//     </div>
//   );
// }


// доп
      {/* <Link href={`/profile/${session.user.id}`} className="btn bg-gray-900 text-white mr-2">
        Профиль
      </Link> */}
      {/* <Link href="/api/auth/signout" className="btn bg-gray-900 text-white mr-2">
        {session.user?.name}
        Выход
      </Link> */}