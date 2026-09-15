export interface IDomainScore {
  domainName: string;
  averageScore: number;
}

export interface IProficiencyDistribution {
  levelName: string;
  count: number;
  percentage: number;
}

export interface IRecentActivity {
  assessmentId: number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  questionSetName: string;
  score: number | null;
  date: string;
  status: string;
}

export interface IOverviewResponse {
  totalStudents: number;
  completedAssessments: number;
  averageCompetencyScore: number;
  questionsNeedingAttention: number;
  scoreByDomain: IDomainScore[];
  proficiencyDistribution: IProficiencyDistribution[];
  recentActivity: IRecentActivity[];
}
