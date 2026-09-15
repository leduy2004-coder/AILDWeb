export interface IDomainProgress {
  domainId: number;
  domainCode: string; // HCM, ETHICS, TECH, DESIGN
  domainName: string;
  score: number; // 0..100
  achievedLevelCode: string | null; // UNDERSTAND, APPLY, CREATE or null
  achievedLevelName: string | null;
  progressPercentage: number;
}

export interface ISkillNode {
  id: number | null;
  domainId: number;
  domainCode: string;
  domainName: string;
  levelId: number;
  levelCode: string; // UNDERSTAND, APPLY, CREATE
  levelName: string;
  status: 'LOCKED' | 'UNLOCKED' | 'COMPLETED' | string;
  recentAccuracy: number | null;
  needsReview: boolean;
  completedAt: string | null;
}

export interface IStudentRecommendedResource {
  id: number;
  title: string;
  description: string;
  url: string;
  domainId: number;
  domainCode: string | null;
  domainName: string | null;
  targetLevelId: number;
  targetLevelCode: string | null;
  targetLevelName: string | null;
}

export interface IStudentDashboardResponse {
  lastEvaluationDate: string | null;
  isEvaluated: boolean;
  finalScore: number | null;
  aiFeedback: string | null;
  domainProgresses: IDomainProgress[];
  skillNodes: ISkillNode[];
  recommendedResources: IStudentRecommendedResource[];
}
