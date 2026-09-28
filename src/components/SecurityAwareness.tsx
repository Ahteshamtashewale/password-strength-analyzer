import React, { useState } from 'react';
import {
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Award,
  Lock,
  Flame,
  Globe,
  Smartphone,
  Key,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Why does modern NIST SP 800-63B advise against mandatory 90-day periodic password expiration?',
    options: [
      'It costs too much storage on enterprise domain controllers.',
      'Users react by making trivial, predictable modifications (e.g. Winter2023! → Spring2024!), degrading actual security.',
      'Hashing algorithms cannot support more than 4 password changes per year.',
      'Modern GPU cracking rigs can only crack passwords older than 90 days.',
    ],
    correctIndex: 1,
    explanation: 'Research demonstrates that frequent forced rotation induces predictable mental heuristics (incrementing numbers, substituting season names), which cracking engines exploit.',
  },
  {
    id: 2,
    question: 'If Alice and Bob choose the identical password "SecretPass123", what ensures their hashes look completely different in the database?',
    options: [
      'A cryptographically random, unique per-user Salt appended prior to hashing.',
      'Using an asymmetrical RSA public key.',
      'Rotating the database connection port.',
      'Applying SSL/TLS during user registration.',
    ],
    correctIndex: 0,
    explanation: 'A unique salt ensures that H(P || SaltA) ≠ H(P || SaltB), preventing rainbow table lookups and mass-cracking across multiple users simultaneously.',
  },
  {
    id: 3,
    question: 'What is the primary cryptographic advantage of a 4-word Diceware passphrase (e.g. "correct-horse-battery-staple") over an 8-char complex password (e.g. "P@ss1!")?',
    options: [
      'Diceware words are registered with NIST for government clearance.',
      'Length exponentially expands combinatorial entropy (7776^4 > 95^8), rendering offline brute-force cracking mathematically infeasible.',
      'Diceware passphrases bypass the need for TLS encryption.',
      'Diceware passwords can be stored in plaintext.',
    ],
    correctIndex: 1,
    explanation: 'Combinatorial search space is governed exponentially by length (N^L). A long passphrase produces vastly greater effective entropy while remaining memorable.',
  },
  {
    id: 4,
    question: 'Which attack vector takes username and password dumps from one company breach and automates login attempts on hundreds of unrelated services?',
    options: [
      'Rainbow table collision',
      'Man-in-the-middle ARP spoofing',
      'Credential Stuffing',
      'Buffer Overflow injection',
    ],
    correctIndex: 2,
    explanation: 'Credential stuffing relies on the human habit of password reuse across multiple personal and corporate accounts.',
  },
  {
    id: 5,
    question: 'Why are FIDO2 / WebAuthn Passkeys inherently immune to credential-harvesting phishing attacks?',
    options: [
      'Passkeys require a 32-character PIN.',
      'Passkeys utilize origin-bound asymmetric key pairs; the browser only sends signatures matching the legitimate domain origin.',
      'Passkeys automatically notify the local police department.',
      'Passkeys encrypt the entire website HTML.',
    ],
    correctIndex: 1,
    explanation: 'WebAuthn cryptographic signatures are tied strictly to the browser\'s verified TLS domain origin (rpId). A fake phishing domain (e.g., evil-bank.com) cannot elicit a signature for bank.com.',
  },
];

export const SecurityAwareness: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attacks' | 'defenses' | 'quiz'>('attacks');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Cyber Security Awareness & Threat Knowledge Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Core educational modules on password attack methodologies, defensive best practices, and virtual internship knowledge verification.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('attacks')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'attacks' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Attack Vectors
          </button>
          <button
            onClick={() => setActiveTab('defenses')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'defenses' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Modern Defenses
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Internship Quiz</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Attack Vectors */}
      {activeTab === 'attacks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Flame className="w-4 h-4" />
              <h3>1. Brute-Force & GPU Cluster Cracking</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Exhaustively enumerating all permutations in a character set. Modern attackers utilize GPU arrays (e.g. 8x NVIDIA RTX 4090 rigs) capable of generating over 100 billion fast hashes (NTLM, MD5, SHA-256) per second.
            </p>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400 font-medium">Attacker Tooling:</div>
              <div className="text-slate-300 font-mono text-[11px]">Hashcat, John the Ripper, custom CUDA kernels</div>
              <div className="text-emerald-400 text-[11px] pt-1 font-medium">
                Mitigation: High combinatorial entropy & slow memory-hard key derivation (Argon2id, bcrypt).
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <h3>2. Dictionary Attacks & Rule-Based Mutations</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of random permutations, attackers use billions of leaked real passwords (from RockYou, Comb, LinkedIn dumps) and apply rule engines like KoreLogic or Best64 to substitute characters (@ for a, 1 for i, appending years).
            </p>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400 font-medium">Common Rule Example:</div>
              <div className="text-slate-300 font-mono text-[11px]">password → P@ssword2024!</div>
              <div className="text-emerald-400 text-[11px] pt-1 font-medium">
                Mitigation: Screening new passwords against breached dictionaries at registration.
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Globe className="w-4 h-4" />
              <h3>3. Credential Stuffing & Botnets</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated botnets take billions of exposed email/password pairs from third-party breaches and feed them into banking, retail, and corporate portals to exploit the 65% of internet users who reuse credentials.
            </p>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400 font-medium">Defense Mechanism:</div>
              <div className="text-emerald-400 text-[11px] font-medium">
                Enforcing unique passwords per site via Password Managers, and mandating MFA/Passkeys.
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <h3>4. Rainbow Tables & Pre-computed Hashes</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Space-time tradeoff tables that pre-compute millions of hash chains for fast constant-time lookup. Allows an attacker with a database of unsalted hashes to crack them in sub-milliseconds without GPU computation.
            </p>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="text-slate-400 font-medium">Defense Mechanism:</div>
              <div className="text-emerald-400 text-[11px] font-medium">
                Cryptographically random CSPRNG salts (≥ 128 bits) appended to each password.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Modern Defenses */}
      {activeTab === 'defenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Key className="w-4 h-4" />
              <h3>The Diceware Passphrase Model (XKCD #936)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than attempting to memorize unpronounceable 10-character symbol soup like <code className="text-rose-300 font-mono">"Tr0ub4dor&3"</code> (which is easy for computers to crack but hard for humans to remember), use 4 to 5 random words like <code className="text-emerald-300 font-mono">"correct-horse-battery-staple"</code>.
            </p>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
              <div>Entropy: ~77 bits of pure entropy</div>
              <div className="text-emerald-400 font-medium">Time to crack on 100B hash/sec GPU rig: ~550,000 years!</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h3>FIDO2 & WebAuthn Passkeys</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Passkeys replace shared secrets with public-key cryptography. The user's biometric authenticator (Touch ID, Windows Hello, YubiKey) stores a private key, and the server stores only the public key.
            </p>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
              <div>Phishing Resistant: Bound to the browser's cryptographic domain origin.</div>
              <div className="text-emerald-400 font-medium">Server database breach reveals no reusable secret.</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Smartphone className="w-4 h-4" />
              <h3>Multi-Factor Authentication (MFA / 2FA)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Combines something you know (password/passphrase) with something you have (hardware key or TOTP authenticator app like Google Authenticator or Bitwarden).
            </p>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
              <div>RFC 6238 TOTP generates rotating 6-digit codes every 30 seconds.</div>
              <div className="text-emerald-400 font-medium">Blocks over 99.9% of automated credential attacks.</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <h3>Zero-Knowledge Password Managers</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Modern password managers (e.g. Bitwarden, 1Password) generate unique 20+ character passwords for every account. The vault is encrypted client-side using PBKDF2/Argon2 + AES-256 before syncing.
            </p>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
              <div>Master password never leaves the user's local memory.</div>
              <div className="text-emerald-400 font-medium">Eliminates password reuse across all personal and work accounts.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Cybersecurity Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Virtual Internship Knowledge Verification Quiz</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Answer these 5 technical cybersecurity questions to certify your understanding for the project submission.
              </p>
            </div>
            {quizSubmitted && (
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-white">
                  Score:{' '}
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {calculateQuizScore()} / {QUIZ_QUESTIONS.length}
                  </span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="text-sm font-semibold text-slate-200 flex items-start gap-2">
                    <span className="text-cyan-400 font-mono">Q{idx + 1}.</span>
                    <span>{q.question}</span>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (selectedOpt === optIdx) {
                        btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200';
                      }

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-200';
                        } else if (selectedOpt === optIdx && !isCorrect) {
                          btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-400">
                      <strong className="text-cyan-300">Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                className="px-5 py-2.5 bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg hover:bg-cyan-300 disabled:opacity-40 transition-colors shadow-sm shadow-cyan-500/20"
              >
                Submit Answers ({Object.keys(selectedAnswers).length}/{QUIZ_QUESTIONS.length} Answered)
              </button>
            </div>
          ) : (
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-center space-y-2">
              <div className="text-sm font-semibold text-cyan-300">
                Quiz Evaluation Completed
              </div>
              <p className="text-xs text-slate-300">
                You scored {calculateQuizScore()} out of {QUIZ_QUESTIONS.length}. Your knowledge verification results are recorded for your internship project submission!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
