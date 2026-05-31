import { NextResponse } from "next/server";

import { db } from "~/server/db";

export async function POST(req: Request) {
  const body = await req.json();

  const user = await db.user.findUnique({
    where: {
      email: body.email,
    },
  });

  return NextResponse.json({
    exists: !!user,
  });
}