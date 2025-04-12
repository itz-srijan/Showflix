import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tmdbID, media_type } = await req.json();

  if (!tmdbID || !media_type) {
    return new NextResponse("tmdbID and media_type are required", {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const updatedWatchlist = user.watchlist.filter(
    (item) => item.tmdbID !== tmdbID || item.media_type !== media_type
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      watchlist: updatedWatchlist,
    },
  });

  return new NextResponse("Item removed from watchlist", { status: 200 });
}
