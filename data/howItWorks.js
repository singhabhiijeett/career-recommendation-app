import { UserPlus, Database, Sparkles, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Share Your Academic Details & Skills",
    description:
      "Enter your education level, skills, interests, and experience so we can understand your academic and professional profile.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Compare Against Career Data",
    description:
      "Our AI matches your profile with similar candidates from our dataset to find patterns in education, skills, and career outcomes.",
    icon: <Database className="w-8 h-8 text-primary" />,
  },
  {
    title: "Get Career Recommendations",
    description:
      "View your best-fit career with a match percentage, reasoning, and alternative paths that suit your background.",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
  },
  {
    title: "Plan Your Career Direction",
    description:
      "Use skill gap analysis and growth suggestions to understand what to learn next for your recommended career path.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
