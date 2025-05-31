import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // Create user if doesn't exist
  if (!user) {
    const { user: clerkUser } = await auth()
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        name: clerkUser?.fullName || clerkUser?.firstName || "",
      },
    })
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
