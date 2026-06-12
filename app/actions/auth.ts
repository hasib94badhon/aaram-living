"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

// ─── Types ───────────────────────────────────────────────────────────────────

type SignupState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
    }
  | undefined;

type LoginState = { error?: string } | undefined;

// ─── Signup ──────────────────────────────────────────────────────────────────

export async function signup(
  state: SignupState,
  formData: FormData
): Promise<SignupState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const errors: NonNullable<SignupState>["errors"] = {};
  if (!name || name.length < 2) errors.name = ["Name must be at least 2 characters"];
  if (!email || !email.includes("@")) errors.email = ["Enter a valid email address"];
  if (!password || password.length < 6) errors.password = ["Password must be at least 6 characters"];
  if (Object.keys(errors).length > 0) return { errors };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { errors: { email: ["This email is already registered"] } };

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "CUSTOMER" },
  });

  await createSession(user.id, "CUSTOMER");
  redirect("/");
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(
  state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password" };

  await createSession(user.id, user.role);

  if (user.role === "ADMIN") {
    redirect("/admin");
  } else {
    redirect("/");
  }
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<never> {
  await deleteSession();
  redirect("/login");
}
