import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    const { email, name, password } = body;
    // Check if the email already exists
    const existingUser = await prismadb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email taken" }, { status: 422 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // const hashedPassword = password
    // Create the user in the database
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(user, { status: 200 }); // Return success response
  } catch (error) {
    console.log("error in api/register ", error);
  }
}
