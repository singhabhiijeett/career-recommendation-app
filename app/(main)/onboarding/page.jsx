import { redirect } from "next/navigation";
import OnboardingForm from "./_components/onboarding-form";
import {
  getUserOnboardingStatus,
  getUserProfileForOnboarding,
} from "@/actions/user";

export default async function OnboardingPage({ searchParams }) {
  const params = await searchParams;
  const isEditMode = params?.edit === "true";

  const { isOnboarded } = await getUserOnboardingStatus();

  if (isOnboarded && !isEditMode) {
    redirect("/dashboard");
  }

  const initialData = isEditMode ? await getUserProfileForOnboarding() : null;

  return (
    <main>
      <OnboardingForm initialData={initialData} isEditMode={isEditMode} />
    </main>
  );
}
