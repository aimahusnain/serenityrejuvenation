"use server";

import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupState = {
  error?: {
    [key: string]: string[];
  } | null;
  success?: boolean;
  message?: string;
} | null;

type LoginState = {
  error?: string | null;
  success?: boolean;
} | null;

type UpdateProfileState = {
  error?: string | null;
  success?: boolean;
} | null;

// ==================== SIGN UP ====================
export async function signup(prevState: SignupState, formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: { email: ["Email already exists"] } };
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Create user preferences
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        emailNotifications: true,
      },
    });

    // Sign in the user after signup
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: true, message: "Account created! Please log in." };
    }

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: { _form: ["Failed to create account. Please try again."] } };
  }
}

// ==================== LOGIN ====================
export async function login(prevState: LoginState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.error("Login error:", result.error);
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Invalid email or password" };
  }
}

// ==================== LOGOUT ====================
export async function logout() {
  await signOut();
  redirect("/");
}

// ==================== UPDATE PROFILE ====================
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").nullish(),
  phone: z.string().nullish(),
  emailNotifications: z.boolean().optional(),
});

export async function updateProfile(prevState: UpdateProfileState, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to update your profile" };
  }

  try {
    const data = {
      name: formData.get("name") as string | null,
      phone: formData.get("phone") as string | null,
      emailNotifications: formData.get("emailNotifications") === "true",
    };

    const validatedFields = updateProfileSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: validatedFields.error.issues[0].message };
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(validatedFields.data.name && { name: validatedFields.data.name }),
      },
    });

    // Update or create preferences
    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });

    if (existingPreferences) {
      await prisma.userPreferences.update({
        where: { userId: session.user.id },
        data: {
          ...(validatedFields.data.phone !== undefined && { phone: validatedFields.data.phone }),
          ...(validatedFields.data.emailNotifications !== undefined && {
            emailNotifications: validatedFields.data.emailNotifications,
          }),
        },
      });
    } else {
      await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          phone: validatedFields.data.phone || null,
          emailNotifications: validatedFields.data.emailNotifications ?? true,
        },
      });
    }

    revalidatePath("/user-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

// ==================== DELETE ACCOUNT ====================
export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  try {
    // Delete user preferences
    await prisma.userPreferences.deleteMany({
      where: { userId: session.user.id },
    });

    // Delete user bookings
    await prisma.booking.deleteMany({
      where: { userId: session.user.id },
    });

    // Delete user sessions (if using database sessions)
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });

    // Delete user accounts (OAuth)
    await prisma.account.deleteMany({
      where: { userId: session.user.id },
    });

    // Delete user
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    await signOut();
    redirect("/");
  } catch (error) {
    console.error("Account deletion error:", error);
    redirect("/user-dashboard?error=delete_failed");
  }
}
