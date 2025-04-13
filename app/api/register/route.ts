import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";
import { userRegistrationSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    const parsedData = userRegistrationSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      );
    }

    // const { email, name, password } = body;
    const { email, name, password } = parsedData.data;

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
        emailVerified: new Date(), // Add the required 'provider' field
      },
    });

    return NextResponse.json(user, { status: 200 }); // Return success response
  } catch (error) {
    console.log("error in api/register ", error);
  }
}
