import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Clear the entire watchlist
  await prisma.user.update({
    where: { id: user.id },
    data: {
      watchlist: [], // Set to empty array
    },
  });

  return new NextResponse("Watchlist cleared successfully", { status: 200 });
}
