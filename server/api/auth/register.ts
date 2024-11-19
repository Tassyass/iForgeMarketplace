import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

const registerSchema = z.object({
  fullName: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const body = req.body;
  const parsedBody = registerSchema.safeParse(body);

  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsedBody.error.flatten() });
  }

  const { fullName, username, email, password } = parsedBody.data;

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10); // Adjust salt rounds as needed

    // Create the new user
    const [newUser] = await db
      .insert(users)
      .values({
        fullName,
        username,
        email,
        password: hashedPassword,
      })
      .returning();

    // Log the user in after registration
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "Registration successful",
        user: { id: newUser.id, username: newUser.username },
      });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
