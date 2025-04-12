// app/api/watchlist/check/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const { searchParams } = new URL(req.url);
  const tmdbID = searchParams.get("tmdbID");
  const media_type = searchParams.get("media_type");

  if (!tmdbID || !media_type) {
    return new Response(JSON.stringify({ message: "Missing parameters" }), {
      status: 400,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });

    const exists = user.watchlist?.some(
      (item) => item.tmdbID === tmdbID && item.media_type === media_type
    );

    return new Response(JSON.stringify({ added: exists }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
