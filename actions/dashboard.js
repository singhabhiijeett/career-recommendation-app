"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateCareerRecommendation } from "@/lib/ai/career-recommendation";

export async function getCareerInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (!user.education || !user.skills?.length) {
    throw new Error("Complete onboarding with education and skills first");
  }

  let recommendation = user.careerRecommendation;

  if (!recommendation) {
    recommendation = await generateCareerRecommendation({
      education: user.education,
      skills: user.skills,
      interests: user.interests,
      experience: user.experience,
      bio: user.bio,
    });

    await db.user.update({
      where: { id: user.id },
      data: { careerRecommendation: recommendation },
    });
  }

  return {
    profile: {
      education: user.education,
      skills: user.skills,
      interests: user.interests,
      experience: user.experience,
      bio: user.bio,
    },
    recommendation,
  };
}

export { generateCareerRecommendation };
