// ── Enums ─────────────────────────────────────────────────────────────────────

export type ApplyMethod = "EMAIL" | "EASY_APPLY_FORM" | "EXTERNAL_FORM" | "UNKNOWN";

export type LeadStatus =
  | "PENDING_REVIEW"
  | "EMAIL_SENT"
  | "AUTO_APPLIED"
  | "MANUAL_REQUIRED"
  | "SKIPPED"
  | "MANUALLY_APPLIED"
  | "FAILED";

export type NotificationType =
  | "JOB_FOUND"
  | "EMAIL_SENT"
  | "AUTO_APPLIED"
  | "MANUAL_REQUIRED"
  | "APPLY_FAILED"
  | "DAILY_SUMMARY";

// ── Config ────────────────────────────────────────────────────────────────────

export interface AutoApplyConfig {
  id?: string;
  targetJobTitles: string[];
  preferredLocations: string[];
  blacklistedCompanies: string[];
  experienceLevel: string;
  autoApplyEnabled: boolean;
  emailApplyEnabled: boolean;
  maxApplicationsPerDay: number;
  minAiMatchScore: number;
  resumeId?: string;
}

// ── Job leads ─────────────────────────────────────────────────────────────────

export interface JobLeadDto {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  jobDescription: string;
  applyUrl?: string;
  applyEmail?: string;
  applyMethod: ApplyMethod;
  status: LeadStatus;
  aiMatchScore: number;
  /** JSON string: string[] */
  matchReasons?: string;
  /** JSON string: ApplicationTemplate */
  applicationTemplate?: string;
  source: string;
  discoveredAt: string;
  appliedAt?: string;
}

export interface ApplicationTemplate {
  subject: string;
  coverLetter: string;
  fields: {
    fullName: string;
    email: string;
    phone: string;
    yearsOfExperience: string;
    currentTitle: string;
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
    summary: string;
  };
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** JSON string */
  metadata?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationMetadata {
  jobLeadId?: string;
  company?: string;
  role?: string;
  score?: number;
  total?: number;
  autoApplied?: number;
  manualRequired?: number;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface AutoApplyStats {
  pending: number;
  autoApplied: number;
  manualRequired: number;
  manuallyApplied: number;
  skipped: number;
}
