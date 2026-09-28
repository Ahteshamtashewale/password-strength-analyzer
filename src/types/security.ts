export type StrengthLevel = 'critical' | 'weak' | 'fair' | 'good' | 'strong';

export interface CharacterSetPool {
  hasLower: boolean;
  hasUpper: boolean;
  hasNumbers: boolean;
  hasSpecial: boolean;
  hasUnicode: boolean;
  poolSize: number;
}

export interface PatternCheckResult {
  hasKeyboardWalk: boolean;
  keyboardWalkDetails?: string;
  hasSequentialRun: boolean;
  sequentialDetails?: string;
  hasRepeatedChars: boolean;
  repeatedDetails?: string;
  isBreached: boolean;
  breachRank?: number;
  breachDetails?: string;
  hasLeetspeak: boolean;
  leetspeakNormalized?: string;
  hasDateOrYear: boolean;
  dateDetails?: string;
}

export interface EntropyMetrics {
  shannonEntropy: number; // Bits per character
  totalShannonEntropy: number; // Shannon * length
  combinatorialEntropy: number; // log2(poolSize^length)
  effectiveEntropy: number; // Combinatorial minus pattern penalties
  poolSize: number;
}

export interface CrackTimeEstimates {
  onlineThrottled: { seconds: number; formatted: string }; // 100/hr
  onlineUnthrottled: { seconds: number; formatted: string }; // 100/sec
  offlineFastHash: { seconds: number; formatted: string }; // 100 billion/sec (MD5/SHA256 GPU farm)
  offlineSlowHash: { seconds: number; formatted: string }; // 10,000/sec (bcrypt / Argon2)
}

export interface PasswordAnalysis {
  input: string;
  sanitizedLength: number;
  strength: StrengthLevel;
  score: number; // 0 to 100
  characterPool: CharacterSetPool;
  entropy: EntropyMetrics;
  patterns: PatternCheckResult;
  crackTimes: CrackTimeEstimates;
  validationErrors: string[];
  recommendations: string[];
  nistCompliant: boolean;
  nistIssues: string[];
  timestamp: string;
}

export type AuditSeverity = 'INFO' | 'SUCCESS' | 'WARN' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'INPUT_VALIDATION' | 'ENTROPY_ANALYSIS' | 'BREACH_DETECTION' | 'PATTERN_CHECK' | 'SECURITY_VERDICT' | 'HASH_EXPERIMENT' | 'TEST_EXECUTION';
  severity: AuditSeverity;
  maskedInput: string;
  sha256Prefix: string;
  inputLength: number;
  message: string;
  details: string;
  executionTimeMs: number;
}

export interface TestVector {
  id: string;
  name: string;
  password: string;
  category: 'Common Breach' | 'Keyboard Walk' | 'Sequential Pattern' | 'Weak PIN' | 'Legacy Corporate' | 'High Entropy' | 'Diceware Passphrase' | 'Unicode Hybrid';
  expectedStrength: StrengthLevel;
  expectedIssue?: string;
  description: string;
}

export interface TestResult {
  vectorId: string;
  vectorName: string;
  passed: boolean;
  actualStrength: StrengthLevel;
  expectedStrength: StrengthLevel;
  entropy: number;
  issuesDetected: string[];
  timeTakenMs: number;
}

export interface InternshipSubmission {
  internName: string;
  studentId: string;
  organization: string;
  mentorName: string;
  submissionDate: string;
  projectTitle: string;
  summaryNotes: string;
  testsPassed: number;
  totalTests: number;
  auditEventsCount: number;
}
