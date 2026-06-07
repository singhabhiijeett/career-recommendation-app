"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateCareerRecommendation } from "@/lib/ai/career-recommendation";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const recommendation = await generateCareerRecommendation({
      education: data.education,
      skills: data.skills,
      interests: data.interests,
      experience: data.experience,
      bio: data.bio,
    });

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        education: data.education,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
        interests: data.interests ?? [],
        careerRecommendation: recommendation,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserProfileForOnboarding() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      education: true,
      skills: true,
      interests: true,
      experience: true,
      bio: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        education: true,
        skills: true,
      },
    });

    if (!user) throw new Error("User not found");

    return {
      isOnboarded: !!(user.education && user.skills?.length),
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
