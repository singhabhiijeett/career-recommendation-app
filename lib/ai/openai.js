import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function parseJsonResponse(text) {
  const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateAIText(prompt, { temperature = 0.5, json = false } = {}) {
  const { text } = await generateText({
    model: openai(OPENAI_MODEL),
    prompt,
    temperature,
  });

  const result = text.trim();
  return json ? parseJsonResponse(result) : result;
}

export function formatUserCareerContext(user) {
  const primaryCareer = user.careerRecommendation?.primaryCareer?.title;
  const lines = [];

  if (user.education) lines.push(`Education: ${user.education}`);
  if (primaryCareer) lines.push(`Recommended career: ${primaryCareer}`);
  else if (user.industry) lines.push(`Background: ${user.industry}`);
  if (user.experience != null) lines.push(`Experience: ${user.experience} years`);
  if (user.skills?.length) lines.push(`Skills: ${user.skills.join(", ")}`);
  if (user.interests?.length) lines.push(`Interests: ${user.interests.join(", ")}`);
  if (user.bio) lines.push(`Professional background: ${user.bio}`);

  return lines.join("\n");
}
