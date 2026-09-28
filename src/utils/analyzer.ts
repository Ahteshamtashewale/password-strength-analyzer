import { PasswordAnalysis, StrengthLevel } from '../types/security';
import {
  checkBreachDictionary,
  checkDateOrYear,
  checkKeyboardWalk,
  checkRepeatedChars,
  checkSequentialRuns,
  normalizeLeetspeak,
} from './breachDatabase';
import {
  calculateCrackTimes,
  calculateEntropyMetrics,
  getCharacterSetPool,
} from './entropy';

export function analyzePassword(rawInput: string): PasswordAnalysis {
  const timestamp = new Date().toISOString();
  const input = rawInput; // Preserve raw for accurate validation
  const length = input.length;

  const validationErrors: string[] = [];
  const recommendations: string[] = [];
  const nistIssues: string[] = [];

  // 1. Input Validation Checks
  if (length === 0) {
    validationErrors.push('Password cannot be empty.');
  } else if (length < 8) {
    validationErrors.push('Password is shorter than the industry baseline of 8 characters.');
  }

  if (length > 128) {
    validationErrors.push('Password exceeds 128 characters (check for buffer overflows or truncation risks).');
  }

  // Check for leading/trailing whitespaces
  if (input.trim() !== input) {
    recommendations.push('Contains leading or trailing whitespaces which may be stripped unpredictably by some login systems.');
  }

  // Character set analysis
  const pool = getCharacterSetPool(input);

  // 2. Pattern and Vulnerability Checks
  const breach = checkBreachDictionary(input);
  const keyboardWalk = checkKeyboardWalk(input);
  const sequential = checkSequentialRuns(input);
  const repeated = checkRepeatedChars(input);
  const datePattern = checkDateOrYear(input);
  const leetNormalized = normalizeLeetspeak(input);
  const hasLeetspeak = leetNormalized !== input.toLowerCase() && input.length >= 4;

  // 3. Penalty Calculation for Effective Entropy
  let penalties = 0;

  if (breach.isBreached) {
    penalties += 35;
    recommendations.push(
      breach.details || 'Found in breached credential databases! Attackers test this immediately in credential stuffing lists.'
    );
    nistIssues.push('Fails NIST SP 800-63B §5.1.1.2: Password appears in breached credential repository.');
  }

  if (keyboardWalk.found) {
    penalties += 16;
    recommendations.push(
      `Avoid spatial keyboard patterns: ${keyboardWalk.pattern}. Automated cracking tools exploit keyboard spatial graphs.`
    );
    nistIssues.push('Fails NIST guideline: Contains predictable keyboard sequence.');
  }

  if (sequential.found) {
    penalties += 14;
    recommendations.push(
      `Avoid sequential runs: ${sequential.pattern}. Sequential characters significantly reduce brute-force search space.`
    );
  }

  if (repeated.found) {
    penalties += 12;
    recommendations.push(
      `Avoid character repetitions: ${repeated.pattern}. Repetitions collapse information entropy.`
    );
    nistIssues.push('Fails NIST SP 800-63B: Contains repetitive or sequential characters.');
  }

  if (datePattern.found) {
    penalties += 10;
    recommendations.push(
      `Avoid dates and calendar years: ${datePattern.pattern}. Attackers regularly use year-based masks (e.g. ?d?d?d?d).`
    );
  }

  if (hasLeetspeak && !breach.isBreached) {
    penalties += 6;
    recommendations.push(
      'Simple leetspeak substitutions (e.g., @ for a, 0 for o, $ for s) are pre-computed in attacker dictionary rules (Hashcat / John the Ripper).'
    );
  }

  // 4. Entropy calculation
  const entropy = calculateEntropyMetrics(input, pool, penalties);
  const crackTimes = calculateCrackTimes(entropy.effectiveEntropy);

  // 5. NIST SP 800-63B Compliance Evaluation
  // Modern NIST SP 800-63B standards:
  // - Minimum 8 characters (15+ recommended for high assurance)
  // - Screened against compromised lists
  // - No predictable sequential or repetitive characters
  // - Allows all printable ASCII and Unicode (spaces, emojis, symbols)
  // - Focus on length and passphrases over arbitrary composition rules
  let nistCompliant = true;
  if (length < 8) {
    nistCompliant = false;
    nistIssues.push('Minimum length must be ≥ 8 characters (NIST SP 800-63B requirement).');
  }
  if (breach.isBreached) {
    nistCompliant = false;
  }
  if (repeated.found || keyboardWalk.found) {
    nistCompliant = false;
  }

  // 6. Score & Strength Assessment
  let score = 0;
  if (length > 0) {
    // Base score from length (up to 40 pts)
    const lengthScore = Math.min(length * 3, 40);

    // Pool diversity score (up to 25 pts)
    let poolScore = 0;
    if (pool.hasLower) poolScore += 5;
    if (pool.hasUpper) poolScore += 6;
    if (pool.hasNumbers) poolScore += 6;
    if (pool.hasSpecial) poolScore += 8;
    if (pool.hasUnicode) poolScore += 5;
    poolScore = Math.min(poolScore, 25);

    // Effective entropy score (up to 35 pts)
    const entropyScore = Math.min(Math.round((entropy.effectiveEntropy / 80) * 35), 35);

    score = lengthScore + poolScore + entropyScore;

    // Apply hard caps for known critical flaws
    if (breach.isBreached) {
      score = Math.min(score, 20);
    } else if (length < 8) {
      score = Math.min(score, 25);
    } else if (keyboardWalk.found && sequential.found) {
      score = Math.min(score, 35);
    }
  }

  score = Math.max(0, Math.min(100, score));

  // Determine strength level
  let strength: StrengthLevel = 'critical';
  if (score >= 80 && length >= 12 && !breach.isBreached) {
    strength = 'strong';
  } else if (score >= 60 && length >= 10 && !breach.isBreached) {
    strength = 'good';
  } else if (score >= 40 && length >= 8) {
    strength = 'fair';
  } else if (score >= 20) {
    strength = 'weak';
  } else {
    strength = 'critical';
  }

  // Positive recommendations if strong
  if (recommendations.length === 0 && length >= 12) {
    recommendations.push('Excellent password composition! Demonstrates strong resistance to brute-force and dictionary attacks.');
    if (length >= 16) {
      recommendations.push('Meets high-assurance NIST enterprise guidelines. High effective entropy provides long-term resistance.');
    }
  } else if (length < 12 && !breach.isBreached) {
    recommendations.push('Increasing length to 14–16+ characters exponentially expands combinatorial search space against GPU rigs.');
  }

  return {
    input,
    sanitizedLength: length,
    strength,
    score,
    characterPool: pool,
    entropy,
    patterns: {
      hasKeyboardWalk: keyboardWalk.found,
      keyboardWalkDetails: keyboardWalk.pattern,
      hasSequentialRun: sequential.found,
      sequentialDetails: sequential.pattern,
      hasRepeatedChars: repeated.found,
      repeatedDetails: repeated.pattern,
      isBreached: breach.isBreached,
      breachRank: breach.rank,
      breachDetails: breach.details,
      hasLeetspeak,
      leetspeakNormalized: hasLeetspeak ? leetNormalized : undefined,
      hasDateOrYear: datePattern.found,
      dateDetails: datePattern.pattern,
    },
    crackTimes,
    validationErrors,
    recommendations,
    nistCompliant,
    nistIssues,
    timestamp,
  };
}
