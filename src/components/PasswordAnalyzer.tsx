import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Clock,
  KeyRound,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PasswordAnalysis } from '../types/security';
import { generateDicewarePassphrase, generateRandomPassword } from '../utils/cryptoDemo';

interface PasswordAnalyzerProps {
  analysis: PasswordAnalysis;
  password: string;
  setPassword: (val: string) => void;
  onGeneratePassphrase: () => void;
  onGenerateRandom: () => void;
}

export const PasswordAnalyzer: React.FC<PasswordAnalyzerProps> = ({
  analysis,
  password,
  setPassword,
  onGeneratePassphrase,
  onGenerateRandom,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const getStrengthBadge = () => {
    switch (analysis.strength) {
      case 'strong':
        return { label: 'Cryptographically Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'good':
        return { label: 'Good / Resilient', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
      case 'fair':
        return { label: 'Fair / Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
      case 'weak':
        return { label: 'Weak / Vulnerable', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
      case 'critical':
      default:
        return { label: 'Critical Risk', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    }
  };

  const strengthBadge = getStrengthBadge();

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Lead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Password Strength & Threat Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time evaluation engine based on NIST SP 800-63B, Shannon entropy, dictionary screening, and GPU cracking threat models.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGeneratePassphrase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 rounded-lg hover:bg-cyan-900/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Passphrase</span>
          </button>
          <button
            onClick={onGenerateRandom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Random (18 Chars)</span>
          </button>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="password-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test Password Input</span>
          </label>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{analysis.sanitizedLength} chars</span>
            <span aria-hidden="true">·</span>
            <span>Pool: {analysis.characterPool.poolSize} symbols</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge Evaluated</span>
          </div>
        </div>

        <div className="relative flex items-center">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste password to evaluate security..."
            className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600 pr-28"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {password && (
              <button
                type="button"
                onClick={() => setPassword('')}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors text-xs rounded hover:bg-slate-800"
                title="Clear input"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded hover:bg-slate-800"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!password}
              className="p-2 text-slate-400 hover:text-slate-200 disabled:opacity-40 transition-colors rounded hover:bg-slate-800"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strength Meter Bar & Score */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Security Score:</span>
              <span className="font-mono font-bold text-white tabular-nums text-sm">
                {password ? analysis.score : 0}
              </span>
              <span className="text-slate-500 font-mono">/ 100</span>
            </div>
            <div className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${strengthBadge.bg} ${strengthBadge.color}`}>
              {password ? strengthBadge.label : 'Awaiting Input'}
            </div>
          </div>

          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                analysis.strength === 'strong'
                  ? 'bg-emerald-500'
                  : analysis.strength === 'good'
                  ? 'bg-cyan-500'
                  : analysis.strength === 'fair'
                  ? 'bg-amber-500'
                  : analysis.strength === 'weak'
                  ? 'bg-orange-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${password ? Math.max(analysis.score, 4) : 0}%` }}
            />
          </div>
        </div>

        {/* Character Composition Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
              analysis.characterPool.hasLower
                ? 'bg-slate-800/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <span>Lowercase (a-z)</span>
            <span className="font-mono font-semibold">{analysis.characterPool.hasLower ? '✓' : '—'}</span>
          </div>
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
              analysis.characterPool.hasUpper
                ? 'bg-slate-800/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <span>Uppercase (A-Z)</span>
            <span className="font-mono font-semibold">{analysis.characterPool.hasUpper ? '✓' : '—'}</span>
          </div>
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
              analysis.characterPool.hasNumbers
                ? 'bg-slate-800/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <span>Numbers (0-9)</span>
            <span className="font-mono font-semibold">{analysis.characterPool.hasNumbers ? '✓' : '—'}</span>
          </div>
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
              analysis.characterPool.hasSpecial
                ? 'bg-slate-800/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <span>Symbols (!@#$)</span>
            <span className="font-mono font-semibold">{analysis.characterPool.hasSpecial ? '✓' : '—'}</span>
          </div>
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition-colors col-span-2 sm:col-span-1 ${
              analysis.characterPool.hasUnicode
                ? 'bg-slate-800/80 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <span>Unicode / Emoji</span>
            <span className="font-mono font-semibold">{analysis.characterPool.hasUnicode ? '✓' : '—'}</span>
          </div>
        </div>
      </div>

      {/* Critical Breach Banner if breached */}
      {analysis.patterns.isBreached && (
        <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl p-4 flex items-start gap-3.5 text-rose-200 animate-in fade-in duration-200">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-rose-300 text-sm flex items-center gap-2">
              <span>Known Breached Credential Detected!</span>
              {analysis.patterns.breachRank && (
                <span className="text-xs bg-rose-900/60 border border-rose-700/60 px-2 py-0.5 rounded font-mono">
                  Rank #{analysis.patterns.breachRank}
                </span>
              )}
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              {analysis.patterns.breachDetails}
            </p>
            <div className="text-xs text-rose-400 font-medium pt-1">
              Impact: Automated botnets execute credential stuffing against this password within milliseconds.
            </div>
          </div>
        </div>
      )}

      {/* Grid: Entropy Analysis & Time to Crack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entropy Metrics Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">
                Information Entropy Breakdown
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              H = -Σ p_i log₂(p_i)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
              <div className="text-xs text-slate-400">Effective Entropy</div>
              <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
                {analysis.entropy.effectiveEntropy}
                <span className="text-xs font-normal text-slate-500 ml-1">bits</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Combinatorial minus pattern penalties
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3">
              <div className="text-xs text-slate-400">Shannon Entropy</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
                {analysis.entropy.shannonEntropy}
                <span className="text-xs font-normal text-slate-500 ml-1">bits/char</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Total: {analysis.entropy.totalShannonEntropy} bits
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">Combinatorial Space</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums mt-1 truncate">
                2<sup>{analysis.entropy.effectiveEntropy > 0 ? Math.round(analysis.entropy.effectiveEntropy) : 0}</sup>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Theoretical search space size
              </div>
            </div>
          </div>

          {/* Pattern Penalty Alerts */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="text-slate-400 font-medium">Heuristic Pattern Detections:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  analysis.patterns.hasKeyboardWalk
                    ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400'
                }`}
              >
                <span>Keyboard Spatial Walk</span>
                <span className="font-mono text-xs">
                  {analysis.patterns.hasKeyboardWalk ? 'VULNERABLE' : 'None'}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  analysis.patterns.hasSequentialRun
                    ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400'
                }`}
              >
                <span>Sequential Alphanumeric</span>
                <span className="font-mono text-xs">
                  {analysis.patterns.hasSequentialRun ? 'VULNERABLE' : 'None'}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  analysis.patterns.hasRepeatedChars
                    ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400'
                }`}
              >
                <span>Repetitive Blocks</span>
                <span className="font-mono text-xs">
                  {analysis.patterns.hasRepeatedChars ? 'VULNERABLE' : 'None'}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  analysis.patterns.hasDateOrYear
                    ? 'bg-amber-950/30 border-amber-600/40 text-amber-200'
                    : 'bg-slate-950/50 border-slate-800/60 text-slate-400'
                }`}
              >
                <span>Calendar Year / Date</span>
                <span className="font-mono text-xs">
                  {analysis.patterns.hasDateOrYear ? 'DETECTED' : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Time-to-Crack Multi-Scenario Threat Modeling */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">
                Brute-Force Time-to-Crack Matrix
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Avg Guesses = 2^(E-1)
            </span>
          </div>

          <div className="space-y-3">
            {/* Online Throttled */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Online Attack (Rate Limited)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  100 attempts / hour (standard web lockout policy)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white tabular-nums">
                  {analysis.crackTimes.onlineThrottled.formatted}
                </div>
              </div>
            </div>

            {/* Online Unthrottled API */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Online Attack (Unthrottled API)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  100 attempts / sec (unprotected endpoint)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-cyan-300 tabular-nums">
                  {analysis.crackTimes.onlineUnthrottled.formatted}
                </div>
              </div>
            </div>

            {/* Offline Fast Hash */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Offline Fast Hash (GPU Rig)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  100 Billion / sec (8x RTX 4090 on MD5/SHA-256)
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold font-mono tabular-nums ${
                  analysis.crackTimes.offlineFastHash.seconds < 60 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {analysis.crackTimes.offlineFastHash.formatted}
                </div>
              </div>
            </div>

            {/* Offline Slow Hash */}
            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Offline Slow Hash (bcrypt / Argon2)
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  10,000 / sec (Key-stretched memory-hard derivation)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  {analysis.crackTimes.offlineSlowHash.formatted}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NIST SP 800-63B Guidelines & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NIST SP 800-63B Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">
                NIST SP 800-63B Digital Identity Alignment
              </h2>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                analysis.nistCompliant
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {analysis.nistCompliant ? 'Compliant' : 'Non-Compliant'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className={`font-mono ${analysis.sanitizedLength >= 8 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {analysis.sanitizedLength >= 8 ? '✓' : '✗'}
              </span>
              <span className="text-slate-300">
                Minimum Length ≥ 8 characters (Current: {analysis.sanitizedLength})
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className={`font-mono ${!analysis.patterns.isBreached ? 'text-emerald-400' : 'text-rose-400'}`}>
                {!analysis.patterns.isBreached ? '✓' : '✗'}
              </span>
              <span className="text-slate-300">
                Screened against compromised dictionaries & breaches
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className={`font-mono ${!analysis.patterns.hasKeyboardWalk && !analysis.patterns.hasSequentialRun ? 'text-emerald-400' : 'text-amber-400'}`}>
                {!analysis.patterns.hasKeyboardWalk && !analysis.patterns.hasSequentialRun ? '✓' : '⚠'}
              </span>
              <span className="text-slate-300">
                Absence of repetitive or sequential character strings
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className="font-mono text-emerald-400">✓</span>
              <span className="text-slate-300">
                All ASCII printable characters and spaces permitted without arbitrary truncation
              </span>
            </div>

            <div className="flex items-start gap-2">
              <span className={`font-mono ${analysis.sanitizedLength >= 15 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {analysis.sanitizedLength >= 15 ? '✓' : '○'}
              </span>
              <span className="text-slate-300">
                High-assurance passphrase length ≥ 15 characters (NIST Recommended)
              </span>
            </div>
          </div>
        </div>

        {/* Security Hardening Recommendations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Hardening Feedback & Remediation
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            {analysis.recommendations.map((rec, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 text-slate-300 leading-relaxed flex items-start gap-2.5">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
            {analysis.recommendations.length === 0 && (
              <p className="text-slate-400 py-4 text-center">
                Enter a password above to view real-time remediation suggestions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
