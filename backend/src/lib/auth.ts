import { currentUser } from "@clerk/nextjs";
import prisma from "./prisma";

// Recupera o usuário Clerk atual e garante presença no banco local
export async function getOrCreateAppUser() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses?.[0]?.emailAddress ?? null;

  let dbUser = await prisma.user.findUnique({ where: { clerkUserId: user.id } });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name: user.firstName ?? null,
        email,
      },
    });
  }

  return dbUser;
}
