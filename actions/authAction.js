
"use server";

import { createSession, deleteSession } from "@/lib/auth";
import { registeredUser, verifyUser } from "@/lib/users";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const errors = [];

  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return { errors: ["Please enter email and password."] };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await verifyUser(normalizedEmail, password);

  if (!result?._id) {
    errors.push(result?.message || "Login failed.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  await createSession(result._id);

  redirect("/");
}

export async function signupAction(prevState, formData) {
  const errors = [];

  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password.trim()
  ) {
    return { errors: ["Please enter email and password."] };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await registeredUser(normalizedEmail, password);

  if (result?.message !== "User registered successfully!") {
    errors.push(result?.message || "Registration failed.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  redirect("/auth?mode=login");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/auth?mode=login");
}

export async function auth(mode, prevState, formData) {
  if (mode === "login") {
    return loginAction(prevState, formData);
  }

  if (mode === "signup") {
    return signupAction(prevState, formData);
  }

  return { errors: ["Invalid authentication mode."] };
}


export async function logout() {
  await deleteSession();
  redirect("/auth?mode=login");
}