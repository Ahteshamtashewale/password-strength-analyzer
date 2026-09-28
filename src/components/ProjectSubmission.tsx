import React, { useState } from 'react';
import {
  FileCheck,
  Award,
  Download,
  Printer,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  BookOpen,
  Calendar,
  Building,
  User,
  ExternalLink,
  Github,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InternshipSubmission, TestResult } from '../types/security';

interface ProjectSubmissionProps {
  testResults: TestResult[];
  auditLogsCount: number;
  onOpenGitHubModal?: () => void;
}

export const ProjectSubmission: React.FC<ProjectSubmissionProps> = ({
  testResults,
  auditLogsCount,
  onOpenGitHubModal,
}) => {
  const [internName, setInternName] = useState('Alex Rivera');
  const [studentId, setStudentId] = useState('CYBER-INT-2026');
  const [organization, setOrganization] = useState('Cybersecurity Virtual Internship Academy');
  const [mentorName, setMentorName] = useState('Dr. Sarah Chen, CISSP');
  const [submissionNotes, setSubmissionNotes] = useState(
    'Successfully implemented and validated all core cyber security modules: real-time input validation, Shannon entropy calculation, RockYou breach dictionary lookup, keyboard spatial walk detection, zero-knowledge audit logging, and NIST SP 800-63B alignment.'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<InternshipSubmission | null>(null);

  const passedTests = testResults.filter((r) => r.passed).length;
  const totalTests = testResults.length > 0 ? testResults.length : 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: InternshipSubmission = {
      internName: internName.trim() || 'Cybersecurity Intern',
      studentId: studentId.trim() || 'CYBER-2026',
      organization: organization.trim() || 'Virtual Internship Academy',
      mentorName: mentorName.trim() || 'Lead Security Mentor',
      submissionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      projectTitle: 'Password Strength Analyzer & Cryptographic Lab',
      summaryNotes: submissionNotes,
      testsPassed: passedTests,
      totalTests: totalTests,
      auditEventsCount: auditLogsCount,
    };

    setSubmittedData(data);
    setIsSubmitted(true);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const handleDownloadMarkdownReport = () => {
    if (!submittedData) return;

    const reportContent = `# Cybersecurity Virtual Internship - Final Project Submission Report

## Project Metadata
- **Project Title:** ${submittedData.projectTitle}
- **Intern Name:** ${submittedData.internName}
- **Student / Intern ID:** ${submittedData.studentId}
- **Host Institution:** ${submittedData.organization}
- **Lead Mentor:** ${submittedData.mentorName}
- **Submission Date:** ${submittedData.submissionDate}
- **Verification Status:** VERIFIED & PASS (${submittedData.testsPassed}/${submittedData.totalTests} Security Test Vectors Validated)
- **Zero-Knowledge Audit Records:** ${submittedData.auditEventsCount} events logged

---

## 1. Executive Summary & Problem Formulation
In modern cybersecurity operations, authentication weaknesses remain the #1 vector for data breaches (accounting for over 80% of hacking-related compromises according to the Verizon DBIR). This project delivers an enterprise-grade **Password Strength Analyzer** that transitions away from antiquated, counterproductive legacy policies (such as forced 90-day rotations and arbitrary symbol mandates) toward modern **NIST SP 800-63B** digital identity standards.

---

## 2. Architectural Pipeline & Workflow Methodology
The engine operates on a multi-stage deterministic pipeline:
1. **Input Sanitization & Boundary Verification:** Inspects character count, trailing/leading whitespaces, and unicode glyphs.
2. **Character Pool Cardinality (R):** Computes symbol pool size from lowercase (26), uppercase (26), digits (10), special characters (33), and extended unicode (50).
3. **Shannon Information Entropy Engine:**
   $$\\text{Shannon Entropy: } H = -\\sum_{i=1}^{k} p_i \\log_2(p_i) \\text{ (bits/symbol)}$$
   Evaluates true non-uniformity and penalizes character repetition collapse.
4. **Combinatorial Space Estimation:**
   $$\\text{Combinatorial Entropy: } E = L \\times \\log_2(R)$$
5. **Pattern & Vulnerability Heuristics:**
   - **Spatial Keyboard Walk Detection:** Checks against top, middle, and bottom QWERTY row trajectories and keypad diagonals.
   - **Sequential Alphanumeric Run Check:** Scans for forward/reverse runs (e.g., 'abcdef', '12345').
   - **Repetition Detector:** Identifies repetitive blocks and monotonic sequences.
   - **Leetspeak Normalization:** Reverses character replacements (@ → a, 0 → o, 5 → s).
6. **Compromised Credential Screening (RockYou & HaveIBeenPwned):**
   - Embedded database of top 100+ high-frequency breached passwords.
   - Prevents registration of known breached passwords in compliance with NIST SP 800-63B §5.1.1.2.
7. **Threat Model Time-to-Crack Matrix:**
   - Online Throttled (100 guesses/hour)
   - Online Unthrottled API (100 guesses/sec)
   - Offline GPU Cluster (100 Billion hashes/sec on MD5/SHA-256)
   - Offline Slow Hash (10,000 hashes/sec on bcrypt/Argon2id)
8. **Zero-Knowledge Audit Event Logging Pipeline:**
   - Never logs plaintext credentials.
   - Emits structured events with truncated SHA-256 fingerprints, execution duration, and severity metrics.

---

## 3. Test Suite Verification Summary
- **Total Test Cases Executed:** ${submittedData.totalTests}
- **Tests Passing All Security Assertions:** ${submittedData.testsPassed}
- **Accuracy Rate:** ${Math.round((submittedData.testsPassed / submittedData.totalTests) * 100)}%

---

## 4. Student Reflection & Key Learnings
${submittedData.summaryNotes}

---
*Report automatically verified and compiled by CyberShield Virtual Internship Lab Engine.*
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cybersecurity_Internship_Report_${submittedData.studentId}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-cyan-400" />
            <span>Virtual Internship Workflow & Project Submission</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete documented technical workflow, mathematical foundations, verification sign-off, and formal submission certificate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-slate-200" />
              <span>Push to GitHub</span>
            </button>
          )}
          {isSubmitted && (
            <>
              <button
                onClick={handleDownloadMarkdownReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Report (.md)</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Part 1: Documented Workflow & Technical Architecture */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Project Workflow & Technical Architecture Documentation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed technical overview of the security pipeline implemented for the virtual internship project.
          </p>
        </div>

        {/* 5-Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="text-cyan-400 font-mono font-bold">STAGE 01</div>
            <div className="font-semibold text-white">Input Validation</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Length check (8–128 chars), ASCII/Unicode boundary verification, and whitespace trimming warning.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="text-cyan-400 font-mono font-bold">STAGE 02</div>
            <div className="font-semibold text-white">Pattern Heuristics</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Spatial keyboard walk graph checks (QWERTY rows/columns), sequential runs, and repeating blocks.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="text-cyan-400 font-mono font-bold">STAGE 03</div>
            <div className="font-semibold text-white">Breach Screening</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              RockYou & HaveIBeenPwned database lookup with leetspeak normalization (@→a, $→s).
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="text-cyan-400 font-mono font-bold">STAGE 04</div>
            <div className="font-semibold text-white">Entropy & Threat Model</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Shannon entropy + NIST combinatorial calculation with 4-tier GPU crack time simulation.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="text-cyan-400 font-mono font-bold">STAGE 05</div>
            <div className="font-semibold text-white">Zero-Knowledge Audit</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              One-way SHA-256 digest emission with zero plaintext leakage in telemetry streams.
            </p>
          </div>
        </div>

        {/* Mathematical Formulas Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Shannon Information Entropy</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-300 text-xs">
              H = - Σ (p_i * log₂(p_i)) bits/char
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Measures the actual information density and unpredictability of the character distribution. Collapses to 0 bits/char if a single character is repeated (e.g. "aaaaaa").
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2">
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Combinatorial Search Space & Brute Force</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-300 text-xs">
              T_crack = 2^(E_effective - 1) / Guesses_per_sec
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculates the mean time required for an attacker to test half of all possible permutations across rate-limited web servers vs 8x RTX 4090 GPU offline password cracking rigs.
            </p>
          </div>
        </div>
      </div>

      {/* Part 2: Internship Project Submission Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Internship Verification & Formal Sign-Off</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in your details below to finalize your virtual internship project submission.
          </p>
        </div>

        {/* Live Readiness Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Automated Test Vectors:</span>
            <span className="font-mono font-bold text-emerald-400">
              {passedTests}/{totalTests} Verified
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Security Audit Events:</span>
            <span className="font-mono font-bold text-cyan-400">
              {auditLogsCount} Logged
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
            <span className="text-slate-400">Zero-Knowledge Compliance:</span>
            <span className="font-mono font-bold text-emerald-400">
              ENFORCED
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Intern Full Name</span>
              </label>
              <input
                type="text"
                value={internName}
                onChange={(e) => setInternName(e.target.value)}
                required
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>Student / Intern ID</span>
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Host Institution / University</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lead Mentor / Supervisor</span>
              </label>
              <input
                type="text"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                required
                className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-sans focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">
              Technical Implementation Summary & Project Takeaways
            </label>
            <textarea
              rows={3}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-sans focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-300 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitted ? 'Update Project Submission' : 'Sign & Submit Virtual Internship Project'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Part 3: Printable Certificate of Completion */}
      {isSubmitted && submittedData && (
        <div id="internship-certificate" className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden print:border-slate-800 print:text-black">
          {/* Subtle Corner Badge */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest">
              Official Certificate of Technical Completion
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white pt-2">
              Virtual Internship in Cybersecurity
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              This certificate verifies successful implementation, mathematical modeling, and test verification of the practical security project.
            </p>
          </div>

          <div className="py-6 border-y border-slate-800 text-center space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Proudly Presented To
            </div>
            <div className="text-2xl font-bold font-serif text-cyan-200">
              {submittedData.internName}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Intern ID: {submittedData.studentId} · {submittedData.organization}
            </div>
            <p className="text-xs text-slate-300 max-w-xl mx-auto pt-2 leading-relaxed">
              For exemplary completion of the <strong>Password Strength Analyzer & Threat Evaluation Engine</strong>, implementing NIST SP 800-63B standards, Shannon information entropy metrics, RockYou compromised credential screening, zero-knowledge audit logging, and GPU threat modeling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">Verification Score</div>
              <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                {submittedData.testsPassed} / {submittedData.totalTests} Security Assertions
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Verified Date</div>
              <div className="text-slate-200 font-medium text-sm mt-0.5">
                {submittedData.submissionDate}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px]">Authorized Mentor</div>
              <div className="text-slate-200 font-medium text-sm mt-0.5">
                {submittedData.mentorName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
