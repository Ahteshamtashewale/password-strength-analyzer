import { TestResult, TestVector } from '../types/security';
import { analyzePassword } from './analyzer';

export const DEFAULT_TEST_VECTORS: TestVector[] = [
  {
    id: 'vec-01',
    name: 'Trivial Sequential PIN',
    password: '123456',
    category: 'Weak PIN',
    expectedStrength: 'critical',
    expectedIssue: 'Common breach & sequential numbers',
    description: 'The single most common breached password worldwide. Demonstrates zero-entropy failure.',
  },
  {
    id: 'vec-02',
    name: 'Horizontal Keyboard Walk',
    password: 'qwertyuiop',
    category: 'Keyboard Walk',
    expectedStrength: 'weak',
    expectedIssue: 'Spatial keyboard graph vulnerability',
    description: 'Straight row traversal across top keyboard row. Easily cracked by spatial mutation engines.',
  },
  {
    id: 'vec-03',
    name: 'Legacy Corporate Pattern',
    password: 'Password123!',
    category: 'Legacy Corporate',
    expectedStrength: 'fair',
    expectedIssue: 'Predictable composition and breached root',
    description: 'Classic uppercase-first + word + digits + symbol pattern fostered by outdated legacy policies.',
  },
  {
    id: 'vec-04',
    name: 'Leetspeak Obfuscated',
    password: 'p@$$w0rd',
    category: 'Common Breach',
    expectedStrength: 'critical',
    expectedIssue: 'Trivial leetspeak normalization',
    description: 'Attacker rule engines (e.g., Hashcat KoreLogic rules) instantly resolve @ to a and $ to s.',
  },
  {
    id: 'vec-05',
    name: 'Character Repetition Collapse',
    password: 'aaaa1111bbbb',
    category: 'Sequential Pattern',
    expectedStrength: 'weak',
    expectedIssue: 'Repetitive sequences destroying entropy',
    description: '12 characters long but comprised of repeating blocks, causing severe Shannon entropy loss.',
  },
  {
    id: 'vec-06',
    name: 'Diceware Multi-Word Passphrase',
    password: 'correct-horse-battery-staple-92',
    category: 'Diceware Passphrase',
    expectedStrength: 'strong',
    expectedIssue: 'None (Modern NIST SP 800-63B Gold Standard)',
    description: 'Long multi-word passphrase exceeding 30 characters. High resistance against GPU offline cracking.',
  },
  {
    id: 'vec-07',
    name: 'High Entropy Cryptographic Random',
    password: 'K9#mQ!9vL$2xW&7pZ*',
    category: 'High Entropy',
    expectedStrength: 'strong',
    expectedIssue: 'None (Maximum diversity and uniform distribution)',
    description: 'Generated from 95-symbol CSPRNG pool. 18 characters yields over 115 bits of combinatorial entropy.',
  },
  {
    id: 'vec-08',
    name: 'Unicode & Emoji Hybrid',
    password: 'Shield🛡️Cipher#2026!',
    category: 'Unicode Hybrid',
    expectedStrength: 'strong',
    expectedIssue: 'None (Exceeds standard 7-bit ASCII constraints)',
    description: 'Combines multi-byte Unicode runes, uppercase, lowercase, symbols, and high character pool size.',
  },
];

export function runSecurityTestSuite(vectors: TestVector[] = DEFAULT_TEST_VECTORS): TestResult[] {
  return vectors.map(vec => {
    const t0 = performance.now();
    const analysis = analyzePassword(vec.password);
    const t1 = performance.now();

    const issues: string[] = [];
    if (analysis.patterns.isBreached) issues.push('Breach detected');
    if (analysis.patterns.hasKeyboardWalk) issues.push('Keyboard walk detected');
    if (analysis.patterns.hasSequentialRun) issues.push('Sequential run detected');
    if (analysis.patterns.hasRepeatedChars) issues.push('Repeated chars detected');
    if (analysis.validationErrors.length > 0) issues.push(...analysis.validationErrors);

    // Pass criteria: Matches expected strength or is within 1 tier, and accurately flags vulnerabilities
    const isStrengthMatch = analysis.strength === vec.expectedStrength;
    const accuratelyFlagged = vec.expectedStrength === 'critical' || vec.expectedStrength === 'weak'
      ? issues.length > 0
      : true;

    return {
      vectorId: vec.id,
      vectorName: vec.name,
      passed: isStrengthMatch && accuratelyFlagged,
      actualStrength: analysis.strength,
      expectedStrength: vec.expectedStrength,
      entropy: analysis.entropy.effectiveEntropy,
      issuesDetected: issues,
      timeTakenMs: Number((t1 - t0).toFixed(2)),
    };
  });
}
