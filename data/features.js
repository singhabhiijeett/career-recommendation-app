import { GraduationCap, BrainCircuit, Target, TrendingUp } from "lucide-react";

export const features = [
  {
    icon: <GraduationCap className="w-10 h-10 mb-4 text-primary" />,
    title: "Academic Profile Analysis",
    description:
      "Your education level and academic background form the foundation for identifying careers you are qualified to pursue.",
  },
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "Skills-Based Matching",
    description:
      "We analyze your skills against career paths where candidates with similar abilities have found success.",
  },
  {
    icon: <Target className="w-10 h-10 mb-4 text-primary" />,
    title: "Personalized Career Suggestions",
    description:
      "Receive a primary career recommendation with a match score and clear reasoning based on your unique profile.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 mb-4 text-primary" />,
    title: "Alternatives & Skill Gaps",
    description:
      "Explore other suitable career options and discover which skills to develop to strengthen your fit.",
  },
];
