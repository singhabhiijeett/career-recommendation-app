"use client";

import Link from "next/link";
import {
  BriefcaseIcon,
  GraduationCap,
  Target,
  TrendingUp,
  Users,
  Brain,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ data }) => {
  const { profile, recommendation } = data;
  const primary = recommendation.primaryCareer;
  const matchPercent = Math.round((primary.matchScore ?? 0) * 100);

  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const generatedAt = recommendation.generatedAt
    ? format(new Date(recommendation.generatedAt), "dd/MM/yyyy HH:mm")
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {generatedAt && (
          <Badge variant="outline">
            Recommendations generated: {generatedAt}
          </Badge>
        )}
        <Button variant="outline" size="sm" asChild className="ml-auto">
          <Link href="/onboarding?edit=true">
            <RefreshCw className="mr-2 h-4 w-4" />
            Update profile & regenerate
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Match</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{primary.title}</div>
            <Progress value={matchPercent} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {matchPercent}% match score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Education</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.education}</div>
            <p className="text-xs text-muted-foreground">
              {profile.experience ?? 0} years experience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendation.demandLevel}
            </div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                recommendation.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendation.marketOutlook}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Primary Career Recommendation
          </CardTitle>
          <CardDescription>
            Based on your education, skills, and similar profiles in our dataset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {primary.reasoning}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Alternative Careers</CardTitle>
            <CardDescription>Other paths that fit your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendation.alternativeCareers?.map((career) => (
              <div
                key={career.title}
                className="border rounded-lg p-3 space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{career.title}</span>
                  <Badge variant="outline">
                    {Math.round((career.matchScore ?? 0) * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {career.reasoning}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skills Development
            </CardTitle>
            <CardDescription>
              Gaps to close and skills to strengthen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Skill gaps</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.skillGaps?.map((skill) => (
                  <Badge key={skill} variant="destructive">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Recommended skills</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.recommendedSkills?.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            {recommendation.growthAreas?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Growth areas</p>
                <ul className="space-y-2">
                  {recommendation.growthAreas.map((area, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {recommendation.similarProfiles?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Similar Profiles from Dataset
            </CardTitle>
            <CardDescription>
              Reference candidates with comparable education and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {recommendation.similarProfiles.map((ref, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 text-sm space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{ref.recommendedCareer}</span>
                    <Badge variant="secondary">
                      {Math.round((ref.score ?? 0) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {ref.education} · {ref.skills}
                  </p>
                  {ref.interests && (
                    <p className="text-muted-foreground text-xs">
                      Interests: {ref.interests}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardView;
