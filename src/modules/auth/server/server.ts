"use server";

import { createSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { BACKEND_URL } from "@/modules/constants";

import { signInSchema } from "../schemas";
import { SignInData } from "../schemas";

async function verifyUser(dni: string, password: string): Promise<{ valid: boolean; userId: string | null }> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/directors/${dni}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { valid: false, userId: null };
    }

    const user = await response.json();
    console.log(user)

    // const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    // if (!isPasswordValid) {
    //   return { valid: false, userId: null };
    // }

    if (user.dni !== dni) {
      return { valid: false, userId: null };
    }

    return { valid: true, userId: user.dni}

  } catch (error) {
    console.error("Error fetching user from API:", error);

    return { valid: false, userId: null };
  }
}

export async function signInAction(signInData: SignInData) {
  const validatedFields = signInSchema.safeParse(signInData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrige los errores en el formulario.",
    };
  }

  const { dni, password } = validatedFields.data;

  const { valid, userId } = await verifyUser(dni, password);
  if (!valid || !userId) {
    return {
      success: false,
      errors: null,
      message: "DNI o contraseña incorrectos. Verifica que el usuario esté registrado.",
    };
  }

  await createSession(userId);

  return {
    success: true,
    message: "Inicio de sesión exitoso.",
  };
}

export async function signOutAction() {
  try {
    await deleteSession()
  } catch (e) {
    console.error(e)
    throw e
  } finally {
    redirect('/sign-in')
  }
}
