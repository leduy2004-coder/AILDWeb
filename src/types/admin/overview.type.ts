export interface IDomainScore {
  domainId: number;
  domainName: string;
  averageScore: number;
}

export interface IDomainStudentScore {
  studentId: number;
  studentName: string;
  studentEmail?: string | null;
  assessmentId: number;
  /** Percent, 0-100 */
  score: number;
  submittedAt: string;
  /** Questions of this domain answered per level 1-3: the same score can come from easy or harder questions */
  levels: ILevelResult[];
}

export interface IDomainQuestionStat {
  questionId: number;
  content: string;
  levelId: number;
  attempts: number;
  correctCount: number;
  /** Percent, 0-100 */
  correctRate: number;
}

export interface ILevelResult {
  levelId: number;
  /** 0 when the test asked no question of this level */
  answered: number;
  correct: number;
}

export interface ILevelStudent {
  studentId: number;
  studentName: string;
  studentEmail?: string | null;
  assessmentId: number;
  submittedAt: string;
  /** Out of 10 */
  finalScore?: number | null;
  /** Levels 1-3 in order */
  levels: ILevelResult[];
}

export interface ILevelDetail {
  /** 0 = not even the first level, 1-3 = highest level reached */
  levelId: number;
  /** Closest to the next level first */
  students: ILevelStudent[];
}

export interface IDomainDetail {
  domainId: number;
  /** Latest completed assessment of each student, lowest score first */
  students: IDomainStudentScore[];
  /** Answered questions of the domain, lowest correct rate first */
  questions: IDomainQuestionStat[];
}

export interface IProficiencyDistribution {
  /** 1-3 = highest level reached, 0 = not even the first level */
  levelId: number;
  levelName: string;
  count: number;
  percentage: number;
}

export type ReviewReason = 'FORCED_BY_VIOLATIONS' | 'VIOLATIONS' | 'SCORE_GAP' | 'TIMED_OUT';

export interface IReviewSubmission {
  assessmentId: number;
  studentId: number;
  studentName: string;
  studentEmail?: string | null;
  submittedAt: string;
  /** Out of 10 */
  mcqScore: number | null;
  interviewScore: number | null;
  finalScore: number | null;
  violationCount: number;
  /** Most serious first */
  reasons: ReviewReason[];
}

export interface IAbnormalQuestion {
  questionId: number;
  content: string;
  domainId: number;
  levelId: number;
  status: string;
  attempts: number;
  /** Percent, 0-100 */
  correctRate: number;
  kind: 'TOO_HARD' | 'TOO_EASY';
}

/** The overview "needs attention" tabs */
export interface IAttentionResponse {
  submissions: IReviewSubmission[];
  reviewWindowDays: number;
  questions: IAbnormalQuestion[];
  minAttempts: number;
}

export interface IOverviewResponse {
  totalStudents: number;
  completedAssessments: number;
  averageCompetencyScore: number;
  totalQuestions: number;
  scoreByDomain: IDomainScore[];
  proficiencyDistribution: IProficiencyDistribution[];
  improvement?: IImprovementSummary;
  scoreParts?: IScoreParts;
  assessmentStatus?: IAssessmentStatus;
}

export interface IActivityBucket {
  /** First day of the period (a month, or a day), yyyy-MM-dd */
  periodStart: string;
  completedCount: number;
  /** Out of 10; null when nothing was completed in the period */
  averageScore: number | null;
}

export interface IActivityResponse {
  year: number;
  /** 1-12, null = the whole year by month */
  month: number | null;
  /** Years with completed assessments plus the current one, newest first */
  years: number[];
  buckets: IActivityBucket[];
}

/** Students who completed the assessment at least twice: first vs latest attempt */
export interface IImprovementSummary {
  retakeStudents: number;
  improvedStudents: number;
  averageFirstScore: number | null;
  averageLatestScore: number | null;
}

export interface IImprovementStudent {
  studentId: number;
  studentName: string;
  studentEmail?: string | null;
  attempts: number;
  firstScore: number;
  latestScore: number;
  delta: number;
  firstSubmittedAt: string;
  latestSubmittedAt: string;
  latestAssessmentId: number;
}

/** Multiple-choice vs interview score over each student's latest completed assessment, out of 10 */
export interface IScoreParts {
  students: number;
  averageMcqScore: number | null;
  averageInterviewScore: number | null;
}

export interface IAssessmentStatus {
  /** Still in progress (multiple choice or interview) */
  activeAssessments: number;
  /** Submitted after the time limit (time-up or expiry job) */
  timedOutAssessments: number;
  withViolations: number;
  /** Submitted because the violation limit was reached */
  forcedByViolations: number;
  studentsCompleted: number;
}
