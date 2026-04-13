// "use server"

// import { $Enums } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import z from "zod";
// import { db } from "~/server/db";
// import { isAdmin } from "../auth/check";


// export async function createUser(formData: FormData) {
//   if (!(await isAdmin()))
//     throw new Error("Unauthorized");

//   const fd = z
//     .object({
//       email: z.string().email(),
//       firstname: z.string(),
//       surname: z.string(),
//     })
//     .parse({
//       email: formData.get("email"),
//       firstname: formData.get("firstname"),
//       surname: formData.get("surname"),
//     });
//   await db.user.create({ data: fd });
//   revalidatePath("/user");
// }

// export async function deleteUser(formData: FormData) {
//   if (!(await isAdmin()))
//     throw new Error("Unauthorized");

//   const fd = z
//     .object({
//       id: z.string(),
//     })
//     .parse({
//       id: formData.get("id"),
//     });
//   await db.user.delete({ where: { id: fd.id } });
//   redirect("/user");
// }

// export async function updateUser(formData: FormData) {
//   if (!(await isAdmin()))
//     throw new Error("Unauthorized");

//   const fd = z
//     .object({
//       id: z.string(),
//       firstname: z.string(),
//       surname: z.string(),
//       role: z.nativeEnum($Enums.Role),
//     })
//     .parse({
//       id: formData.get("id"),
//       firstname: formData.get("firstname"),
//       surname: formData.get("surname"),
//       role: formData.get("role"),
//     });
//   await db.user.update({ where: { id: fd.id }, data: fd });
//   revalidatePath("/user/" + fd.id);
// }