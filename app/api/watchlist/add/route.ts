// app/api/watchlist/add/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { tmdbID, title, media_type, posterUrl } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  // Check for duplicate
  const alreadyExists = user.watchlist.some(
    (item) => item.tmdbID === tmdbID && item.media_type === media_type
  );

  if (alreadyExists) {
    return new NextResponse("Already in watchlist", { status: 409 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      watchlist: {
        push: {
          tmdbID,
          title,
          media_type,
          posterUrl,
        },
      },
    },
  });

  return NextResponse.json(updatedUser.watchlist);
}
