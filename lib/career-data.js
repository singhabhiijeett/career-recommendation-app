import { readFileSync } from "fs";
import path from "path";

let cachedDataset = null;

export function getCareerDataset() {
  if (!cachedDataset) {
    const filePath = path.join(
      process.cwd(),
      "AI-based Career Recommendation System.json"
    );
    cachedDataset = JSON.parse(readFileSync(filePath, "utf-8"));
  }
  return cachedDataset;
}

export function getCareerCatalog() {
  const dataset = getCareerDataset();
  const careers = [...new Set(dataset.map((row) => row.Recommended_Career))];
  return careers.sort();
}

function normalizeSkill(skill) {
  return skill.trim().toLowerCase();
}

function parseSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.map(normalizeSkill).filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills
      .split(/[,;]/)
      .map(normalizeSkill)
      .filter(Boolean);
  }
  return [];
}

function skillOverlap(userSkills, candidateSkills) {
  let score = 0;
  for (const userSkill of userSkills) {
    for (const candidateSkill of candidateSkills) {
      if (
        userSkill === candidateSkill ||
        userSkill.includes(candidateSkill) ||
        candidateSkill.includes(userSkill)
      ) {
        score += 1;
        break;
      }
    }
  }
  return score;
}

export function getSimilarCandidates(profile, limit = 12) {
  const dataset = getCareerDataset();
  const userSkills = parseSkills(profile.skills);
  const userInterests = parseSkills(profile.interests);

  const ranked = dataset
    .map((row) => {
      const candidateSkills = parseSkills(row.Skills);
      const candidateInterests = parseSkills(row.Interests);
      const educationMatch = row.Education === profile.education ? 3 : 0;
      const skillsMatch = skillOverlap(userSkills, candidateSkills) * 2;
      const interestsMatch = skillOverlap(userInterests, candidateInterests);

      return {
        ...row,
        relevanceScore: educationMatch + skillsMatch + interestsMatch,
      };
    })
    .filter((row) => row.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  if (ranked.length > 0) return ranked;

  return dataset
    .filter((row) => row.Education === profile.education)
    .slice(0, limit);
}

export function summarizeDatasetForPrompt() {
  const dataset = getCareerDataset();
  const byCareer = {};

  for (const row of dataset) {
    if (!byCareer[row.Recommended_Career]) {
      byCareer[row.Recommended_Career] = {
        career: row.Recommended_Career,
        educationLevels: new Set(),
        sampleSkills: new Set(),
        avgScore: 0,
        count: 0,
      };
    }
    const entry = byCareer[row.Recommended_Career];
    entry.educationLevels.add(row.Education);
    row.Skills.split(";")
      .slice(0, 3)
      .forEach((s) => entry.sampleSkills.add(s.trim()));
    entry.avgScore += row.Recommendation_Score;
    entry.count += 1;
  }

  return Object.values(byCareer).map((entry) => ({
    career: entry.career,
    educationLevels: [...entry.educationLevels],
    sampleSkills: [...entry.sampleSkills].slice(0, 5),
    avgRecommendationScore: Number(
      (entry.avgScore / entry.count).toFixed(2)
    ),
    profileCount: entry.count,
  }));
}
