import {
  getCareerCatalog,
  getSimilarCandidates,
  summarizeDatasetForPrompt,
} from "@/lib/career-data";
import { generateAIText } from "@/lib/ai/openai";

export async function generateCareerRecommendation(profile) {
  const similarCandidates = getSimilarCandidates(profile);
  const careerCatalog = getCareerCatalog();
  const careerSummary = summarizeDatasetForPrompt();

  const prompt = `You are an AI career recommendation system. Analyze the candidate profile and reference data, then recommend the best career paths.

CANDIDATE PROFILE:
- Education: ${profile.education}
- Skills: ${Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills}
- Interests: ${Array.isArray(profile.interests) && profile.interests.length ? profile.interests.join(", ") : "Not specified"}
- Years of experience: ${profile.experience ?? 0}
- Bio: ${profile.bio || "Not provided"}

SIMILAR PROFILES FROM TRAINING DATA (Education, Skills, Interests → Recommended Career, Score):
${JSON.stringify(
  similarCandidates.map((c) => ({
    Education: c.Education,
    Skills: c.Skills,
    Interests: c.Interests,
    Recommended_Career: c.Recommended_Career,
    Recommendation_Score: c.Recommendation_Score,
  })),
  null,
  2
)}

CAREER CATALOG (valid career titles from dataset — prefer these):
${careerCatalog.join(", ")}

CAREER SUMMARY FROM DATASET:
${JSON.stringify(careerSummary.slice(0, 20), null, 2)}

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "primaryCareer": {
    "title": "string from career catalog",
    "matchScore": number between 0 and 1,
    "reasoning": "2-3 sentences explaining why this fits education and skills"
  },
  "alternativeCareers": [
    { "title": "string", "matchScore": number between 0 and 1, "reasoning": "one sentence" }
  ],
  "skillGaps": ["skills the candidate should develop"],
  "recommendedSkills": ["skills to strengthen for recommended career"],
  "growthAreas": ["areas to focus learning"],
  "demandLevel": "High" | "Medium" | "Low",
  "marketOutlook": "Positive" | "Neutral" | "Negative"
}

Include exactly 3 alternativeCareers. Base matchScore on similarity to reference profiles and skill/education alignment.`;

  const recommendation = await generateAIText(prompt, {
    temperature: 0.4,
    json: true,
  });

  return {
    ...recommendation,
    similarProfiles: similarCandidates.slice(0, 5).map((c) => ({
      education: c.Education,
      skills: c.Skills,
      interests: c.Interests,
      recommendedCareer: c.Recommended_Career,
      score: c.Recommendation_Score,
    })),
    generatedAt: new Date().toISOString(),
  };
}
