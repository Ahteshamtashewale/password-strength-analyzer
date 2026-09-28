import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Database,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { computeSHA256, generateRandomSalt, simulatePBKDF2 } from '../utils/cryptoDemo';

export const AuthenticationLab: React.FC = () => {
  // Salting & Hashing state
  const [labPassword, setLabPassword] = useState('MySecretPass#2026');
  const [labSalt, setLabSalt] = useState('');
  const [useSalt, setUseSalt] = useState(true);
  const [selectedAlgo, setSelectedAlgo] = useState<'sha256' | 'pbkdf2'>('sha256');
  const [iterations, setIterations] = useState(100000);
  const [computedHash, setComputedHash] = useState('');
  const [hashTime, setHashTime] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);

  // Twin hash demo (identical password, different salts)
  const [twin1Salt, setTwin1Salt] = useState('a9f4c281e09b11d4');
  const [twin2Salt, setTwin2Salt] = useState('7e3a98d022b7c65f');
  const [twin1Hash, setTwin1Hash] = useState('');
  const [twin2Hash, setTwin2Hash] = useState('');

  // Rainbow table test state
  const [rainbowQuery, setRainbowQuery] = useState('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
  const [rainbowResult, setRainbowResult] = useState<{ match: boolean; plaintext?: string; notes: string } | null>(null);

  // Initialize salt
  useEffect(() => {
    setLabSalt(generateRandomSalt(16));
  }, []);

  // Compute hash when inputs change
  useEffect(() => {
    let isCancelled = false;

    async function runHash() {
      const payload = useSalt ? `${labPassword}${labSalt}` : labPassword;
      const t0 = performance.now();

      if (selectedAlgo === 'sha256') {
        const hash = await computeSHA256(payload);
        const t1 = performance.now();
        if (!isCancelled) {
          setComputedHash(hash);
          setHashTime(Number((t1 - t0).toFixed(2)));
        }
      } else {
        const res = await simulatePBKDF2(labPassword, labSalt || '00', iterations);
        if (!isCancelled) {
          setComputedHash(res.hash);
          setHashTime(res.elapsedMs);
        }
      }
    }

    runHash();
    return () => {
      isCancelled = true;
    };
  }, [labPassword, labSalt, useSalt, selectedAlgo, iterations]);

  // Compute twin hashes
  useEffect(() => {
    async function updateTwins() {
      const h1 = await computeSHA256(`password123${twin1Salt}`);
      const h2 = await computeSHA256(`password123${twin2Salt}`);
      setTwin1Hash(h1);
      setTwin2Hash(h2);
    }
    updateTwins();
  }, [twin1Salt, twin2Salt]);

  const handleNewSalt = () => {
    setLabSalt(generateRandomSalt(16));
  };

  const handleCopyHash = async () => {
    if (!computedHash) return;
    try {
      await navigator.clipboard.writeText(computedHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {}
  };

  // Mock rainbow table with 5 common unsalted SHA-256 hashes
  const RAINBOW_TABLE: Record<string, string> = {
    // 'password'
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
    // '123456'
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92': '123456',
    // 'qwerty'
    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5': 'qwerty',
    // 'admin'
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918': 'admin',
    // 'welcome'
    '680e6c5264b97dfa12d1264c86e065bc3e4ee4d3ef37f94bbd85834fc07b5b54': 'welcome',
  };

  const handleRainbowSearch = () => {
    const trimmed = rainbowQuery.trim().toLowerCase();
    if (RAINBOW_TABLE[trimmed]) {
      setRainbowResult({
        match: true,
        plaintext: RAINBOW_TABLE[trimmed],
        notes: 'Pre-computed Rainbow Table HIT! Unsalted hash cracked instantly in < 0.1 ms.',
      });
    } else {
      setRainbowResult({
        match: false,
        notes: 'MISS! Not present in pre-computed unsalted lookup table. Salted hashes force individual brute-force per user.',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-cyan-400" />
          <span>Authentication Concepts & Cryptographic Laboratory</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hands-on simulation of password hashing, CSPRNG salting, key stretching, rainbow table defense, and modern NIST SP 800-63B standards.
        </p>
      </div>

      {/* Module 1: Hashing & Salting Playground */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              <span>Cryptographic Hashing & Salting Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Observe how a 128-bit CSPRNG salt and key-stretching algorithms dramatically increase attack resistance.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setSelectedAlgo('sha256')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedAlgo === 'sha256' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              SHA-256 (Fast Hash)
            </button>
            <button
              onClick={() => setSelectedAlgo('pbkdf2')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedAlgo === 'pbkdf2' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              PBKDF2 (Key Stretched)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Plaintext Password</label>
            <input
              type="text"
              value={labPassword}
              onChange={(e) => setLabPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500">Notice the Avalanche Effect: changing a single letter yields a totally uncorrelated digest.</p>
          </div>

          {/* Salt Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>CSPRNG Salt (Hex)</span>
                <span className="text-[11px] text-cyan-400">Unique per user</span>
              </label>
              <button
                onClick={handleNewSalt}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>New Salt</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={labSalt}
                onChange={(e) => setLabSalt(e.target.value)}
                disabled={!useSalt}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSalt}
                  onChange={(e) => setUseSalt(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span>Enable Salt Injection</span>
              </label>
              {selectedAlgo === 'pbkdf2' && (
                <div className="text-xs text-slate-400 font-mono">
                  {iterations.toLocaleString()} iterations
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hash Output Display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">Derived Cryptographic Digest</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-cyan-400">
                Algorithm: {selectedAlgo.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 tabular-nums">
                Latency: {hashTime} ms
              </span>
              <button
                onClick={handleCopyHash}
                className="p-1 hover:text-white transition-colors text-slate-400"
                title="Copy Hash"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-cyan-300 break-all select-all">
            {computedHash || 'Computing...'}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Payload: {useSalt ? `"${labPassword}" + "${labSalt.substring(0, 8)}..."` : `"${labPassword}" (UNSALTED)`}</span>
            <span className="text-slate-500">256 bits / 64 hex characters</span>
          </div>
        </div>
      </div>

      {/* Module 2: Twin Password Rainbow Table Defense Demo */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Why Salting Destroys Rainbow Tables</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Two users in the database both have the exact same password: <code className="text-cyan-300 font-mono">"password123"</code>. Because each has a unique random salt, their stored hashes are completely different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>User A (Alice)</span>
              <span className="font-mono text-[11px] text-slate-500">Salt: {twin1Salt}</span>
            </div>
            <div className="text-xs text-slate-400">
              Password: <span className="text-slate-200 font-mono">password123</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 truncate">
              {twin1Hash}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>User B (Bob)</span>
              <span className="font-mono text-[11px] text-slate-500">Salt: {twin2Salt}</span>
            </div>
            <div className="text-xs text-slate-400">
              Password: <span className="text-slate-200 font-mono">password123</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-cyan-400 truncate">
              {twin2Hash}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Cybersecurity Takeaway:</strong> An attacker with a pre-computed Rainbow Table of 100 billion common password hashes cannot look up Bob's hash or Alice's hash, because the unique salt changes the input space from <code className="text-cyan-300 font-mono">H(P)</code> to <code className="text-cyan-300 font-mono">H(P || S)</code>, requiring a bespoke 100-billion entry table for each individual salt!
          </div>
        </div>
      </div>

      {/* Module 3: Rainbow Table Query Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Interactive Rainbow Table Lookup Simulator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test how pre-computed hash lookup attacks work on unsalted SHA-256 hashes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={rainbowQuery}
            onChange={(e) => setRainbowQuery(e.target.value)}
            placeholder="Paste a SHA-256 hash to test rainbow lookup..."
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleRainbowSearch}
            className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-cyan-400 transition-colors whitespace-nowrap"
          >
            Query Table
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>Sample pre-computed hashes:</span>
          <button
            onClick={() => setRainbowQuery('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')}
            className="text-cyan-400 hover:underline font-mono text-[11px]"
          >
            "password"
          </button>
          <span>·</span>
          <button
            onClick={() => setRainbowQuery('8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92')}
            className="text-cyan-400 hover:underline font-mono text-[11px]"
          >
            "123456"
          </button>
          <span>·</span>
          <button
            onClick={() => setRainbowQuery('65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5')}
            className="text-cyan-400 hover:underline font-mono text-[11px]"
          >
            "qwerty"
          </button>
          <span>·</span>
          <button
            onClick={() => setRainbowQuery(computedHash)}
            className="text-amber-400 hover:underline font-mono text-[11px]"
          >
            Current Sandbox Hash
          </button>
        </div>

        {rainbowResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
              rainbowResult.match
                ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-200'
            }`}
          >
            <div className="font-semibold text-sm mb-1 flex items-center gap-2">
              {rainbowResult.match ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Vulnerability: Pre-computed Match Found!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Resilient: Hash Not in Rainbow Table</span>
                </>
              )}
            </div>
            {rainbowResult.plaintext && (
              <div className="font-mono text-xs my-1">
                Recovered Plaintext: <strong className="text-white bg-slate-900 px-1.5 py-0.5 rounded">"{rainbowResult.plaintext}"</strong>
              </div>
            )}
            <p className="mt-1 opacity-90">{rainbowResult.notes}</p>
          </div>
        )}
      </div>

      {/* Module 4: NIST SP 800-63B vs Legacy Policies Comparator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>NIST SP 800-63B vs. Legacy Corporate Password Policies</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding why modern cybersecurity standards discarded 90-day forced resets and composition rules.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Security Domain</th>
                <th className="py-2.5 px-3 font-semibold text-rose-400">Legacy Policy (Obsolete)</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-400">Modern NIST SP 800-63B</th>
                <th className="py-2.5 px-3 font-semibold">Cybersecurity Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-medium text-white">Periodic Expiration</td>
                <td className="py-3 px-3 text-rose-300">Forced reset every 60–90 days</td>
                <td className="py-3 px-3 text-emerald-300">Only change upon evidence of compromise</td>
                <td className="py-3 px-3 text-slate-400">
                  Frequent forced resets induce predictable user patterns (<code className="text-slate-300">Winter2024!</code> → <code className="text-slate-300">Spring2024!</code>).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">Composition Rules</td>
                <td className="py-3 px-3 text-rose-300">Require 1 upper, 1 lower, 1 digit, 1 symbol</td>
                <td className="py-3 px-3 text-emerald-300">No arbitrary composition rules; focus on length</td>
                <td className="py-3 px-3 text-slate-400">
                  Users satisfy rules with trailing exclamation marks and capitalized first letters, failing to increase entropy.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">Length Standard</td>
                <td className="py-3 px-3 text-rose-300">8 character minimum</td>
                <td className="py-3 px-3 text-emerald-300">8 min, 15+ recommended (passphrases)</td>
                <td className="py-3 px-3 text-slate-400">
                  Combinatorial search space grows exponentially with length: $N^L$. Length trumps character complexity.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">Compromise Screening</td>
                <td className="py-3 px-3 text-rose-300">None; reliance on user compliance</td>
                <td className="py-3 px-3 text-emerald-300">Mandatory check against breached credential lists</td>
                <td className="py-3 px-3 text-slate-400">
                  Instantly prevents users from selecting any password present in RockYou or HaveIBeenPwned databases.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-white">Authentication Factors</td>
                <td className="py-3 px-3 text-rose-300">Single-factor passwords</td>
                <td className="py-3 px-3 text-emerald-300">Multi-Factor Authentication (MFA / Passkeys)</td>
                <td className="py-3 px-3 text-slate-400">
                  Phishing-resistant WebAuthn/FIDO2 credentials neutralize stolen password credentials entirely.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
