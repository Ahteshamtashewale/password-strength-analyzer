import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FlaskConical,
  ExternalLink,
  Plus,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { StrengthLevel, TestResult, TestVector } from '../types/security';
import { DEFAULT_TEST_VECTORS, runSecurityTestSuite } from '../utils/testVectors';
import { analyzePassword } from '../utils/analyzer';

interface TestSuiteProps {
  testResults: TestResult[];
  onRunAllTests: () => void;
  onSelectPassword: (pwd: string) => void;
}

export const TestSuite: React.FC<TestSuiteProps> = ({
  testResults,
  onRunAllTests,
  onSelectPassword,
}) => {
  const [customPassword, setCustomPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [customExpected, setCustomExpected] = useState<StrengthLevel>('fair');
  const [customResult, setCustomResult] = useState<TestResult | null>(null);

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length > 0 ? testResults.length : DEFAULT_TEST_VECTORS.length;

  const handleRunCustomTest = () => {
    if (!customPassword) return;
    const t0 = performance.now();
    const analysis = analyzePassword(customPassword);
    const t1 = performance.now();

    const issues: string[] = [];
    if (analysis.patterns.isBreached) issues.push('Breach detected');
    if (analysis.patterns.hasKeyboardWalk) issues.push('Keyboard walk detected');
    if (analysis.patterns.hasSequentialRun) issues.push('Sequential run detected');
    if (analysis.patterns.hasRepeatedChars) issues.push('Repeated characters detected');

    const passed = analysis.strength === customExpected;

    setCustomResult({
      vectorId: 'custom-test',
      vectorName: customName || 'Custom Input Test',
      passed,
      actualStrength: analysis.strength,
      expectedStrength: customExpected,
      entropy: analysis.entropy.effectiveEntropy,
      issuesDetected: issues,
      timeTakenMs: Number((t1 - t0).toFixed(2)),
    });
  };

  const getStrengthColor = (s: StrengthLevel) => {
    switch (s) {
      case 'strong': return 'text-emerald-400';
      case 'good': return 'text-cyan-400';
      case 'fair': return 'text-amber-400';
      case 'weak': return 'text-orange-400';
      case 'critical': return 'text-rose-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <span>Cybersecurity Automated Test Suite</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verification harness executing 8 standardized cryptographic test vectors against the analysis pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {testResults.length > 0 && (
            <div className="text-xs font-mono text-slate-400">
              Score:{' '}
              <span className={`font-bold ${passedCount === totalCount ? 'text-emerald-400' : 'text-amber-400'}`}>
                {passedCount}/{totalCount} Passed
              </span>
            </div>
          )}
          <button
            onClick={onRunAllTests}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors shadow-sm shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run All Tests</span>
          </button>
        </div>
      </div>

      {/* Test Vectors Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Test Vector</th>
                <th className="py-2.5 px-3 font-semibold">Classification</th>
                <th className="py-2.5 px-3 font-semibold">Sample Value</th>
                <th className="py-2.5 px-3 font-semibold text-center">Expected</th>
                <th className="py-2.5 px-3 font-semibold text-center">Engine Result</th>
                <th className="py-2.5 px-3 font-semibold">Entropy</th>
                <th className="py-2.5 px-3 font-semibold text-center">Verdict</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {DEFAULT_TEST_VECTORS.map((vec) => {
                const result = testResults.find((r) => r.vectorId === vec.id);

                return (
                  <tr key={vec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans text-white font-medium">
                      <div>{vec.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{vec.description}</div>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                        {vec.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-cyan-300 font-mono text-xs">
                      {vec.password}
                    </td>
                    <td className="py-3 px-3 text-center uppercase font-bold text-[11px]">
                      <span className={getStrengthColor(vec.expectedStrength)}>
                        {vec.expectedStrength}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center uppercase font-bold text-[11px]">
                      {result ? (
                        <span className={getStrengthColor(result.actualStrength)}>
                          {result.actualStrength}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-slate-300">
                      {result ? `${result.entropy} bits` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {result ? (
                        result.passed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            FAIL
                          </span>
                        )
                      ) : (
                        <span className="text-slate-500 text-[11px] font-sans">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectPassword(vec.password)}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-sans text-[11px] transition-colors"
                        title="Analyze in main panel"
                      >
                        <span>Analyze</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Test Vector Builder */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Interactive Custom Test Assertion</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define a custom test vector and assert if the analyzer matches your predicted cybersecurity rating.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-medium">Test Case Label</label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. My Custom Walk"
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 font-medium">Test Password String</label>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => setCustomPassword(e.target.value)}
              placeholder="Enter password string to test..."
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium">Expected Rating</label>
            <select
              value={customExpected}
              onChange={(e) => setCustomExpected(e.target.value as StrengthLevel)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="critical">Critical</option>
              <option value="weak">Weak</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-slate-400">
            {customPassword && <span>Length: {customPassword.length} characters</span>}
          </div>
          <button
            onClick={handleRunCustomTest}
            disabled={!customPassword}
            className="px-4 py-2 bg-slate-800 text-cyan-300 font-semibold text-xs rounded-lg hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            Execute Assertion
          </button>
        </div>

        {customResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              customResult.passed
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-sm mb-1">
              <span className="flex items-center gap-2">
                {customResult.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                <span>{customResult.passed ? 'Assertion Passed!' : 'Assertion Discrepancy'}</span>
              </span>
              <span className="font-mono text-xs tabular-nums">{customResult.timeTakenMs} ms</span>
            </div>
            <div>
              Expected: <strong className="uppercase">{customResult.expectedStrength}</strong> ·
              Actual Output: <strong className="uppercase ml-1">{customResult.actualStrength}</strong> ·
              Effective Entropy: <strong className="font-mono ml-1">{customResult.entropy} bits</strong>
            </div>
            {customResult.issuesDetected.length > 0 && (
              <div className="mt-1 text-[11px] opacity-90">
                Flags: {customResult.issuesDetected.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
