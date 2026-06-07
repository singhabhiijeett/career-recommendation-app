"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";

const EDUCATION_OPTIONS = ["Bachelor's", "Master's", "PhD"];

function toFormDefaults(initialData) {
  if (!initialData) return undefined;

  return {
    education: initialData.education ?? "",
    skills: initialData.skills?.join(", ") ?? "",
    interests: initialData.interests?.join(", ") ?? "",
    experience:
      initialData.experience != null ? String(initialData.experience) : "",
    bio: initialData.bio ?? "",
  };
}

const OnboardingForm = ({ initialData = null, isEditMode = false }) => {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: toFormDefaults(initialData),
  });

  const educationValue = watch("education");

  useEffect(() => {
    const defaults = toFormDefaults(initialData);
    if (!defaults) return;

    Object.entries(defaults).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [initialData, setValue]);

  const onSubmit = async (values) => {
    try {
      setIsAnalyzing(true);
      await updateUserFn(values);
    } catch (error) {
      console.error("Onboarding error:", error);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      setIsAnalyzing(false);
      toast.success(
        isEditMode
          ? "Profile updated! New career recommendations are ready."
          : "Profile saved! Your career recommendations are ready."
      );
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router, isEditMode]);

  const busy = updateLoading || isAnalyzing;

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          {isEditMode && (
            <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to recommendations
              </Link>
            </Button>
          )}
          <CardTitle className="gradient-title text-4xl">
            {isEditMode ? "Update Your Profile" : "Complete Your Profile"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Change your education, skills, or interests and we will regenerate your career recommendations."
              : "Share your education and skills so we can analyze your profile against our career dataset and suggest the best career paths for you."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="education">Educational Qualification</Label>
              <Select
                value={educationValue}
                onValueChange={(value) => setValue("education", value)}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select your highest qualification" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, Data Analysis, Machine Learning"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests (optional)</Label>
              <Input
                id="interests"
                placeholder="e.g., Technology, Data Science, Healthcare"
                {...register("interests")}
              />
              <p className="text-sm text-muted-foreground">
                Helps match careers from similar candidate profiles
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio (optional)</Label>
              <Textarea
                id="bio"
                placeholder="Brief background, goals, or domains you enjoy..."
                className="h-32"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode
                    ? "Regenerating recommendations..."
                    : "Analyzing your profile with AI..."}
                </>
              ) : isEditMode ? (
                "Regenerate Career Recommendations"
              ) : (
                "Get Career Recommendations"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
