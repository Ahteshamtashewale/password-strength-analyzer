import React, { useState } from 'react';
import {
  Github,
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Terminal,
  ShieldCheck,
  FolderArchive,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import JSZip from 'jszip';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [repoName, setRepoName] = useState('password-strength-analyzer');
  const [githubUsername, setGithubUsername] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const effectiveUser = githubUsername.trim() || '<your-github-username>';
  const repoUrl = `https://github.com/${effectiveUser}/${repoName}.git`;

  const commands = [
    `git remote add origin ${repoUrl}`,
    `git branch -M main`,
    `git push -u origin main`,
  ];

  const fullCommandString = `# Navigate to project and push to your GitHub repo:\n${commands.join('\n')}`;

  const ghCliCommand = `gh repo create ${repoName} --public --source=. --remote=origin --push`;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // List of core files to bundle for direct GitHub upload/clone
      const filesToFetch = [
        'package.json',
        'tsconfig.json',
        'vite.config.ts',
        'index.html',
        '.gitignore',
        '.env.example',
        'README.md',
        'metadata.json',
        'src/main.tsx',
        'src/index.css',
        'src/App.tsx',
        'src/types/security.ts',
        'src/utils/analyzer.ts',
        'src/utils/entropy.ts',
        'src/utils/breachDatabase.ts',
        'src/utils/cryptoDemo.ts',
        'src/utils/testVectors.ts',
        'src/components/Header.tsx',
        'src/components/PasswordAnalyzer.tsx',
        'src/components/AuthenticationLab.tsx',
        'src/components/AuditLogger.tsx',
        'src/components/SecurityAwareness.tsx',
        'src/components/TestSuite.tsx',
        'src/components/ProjectSubmission.tsx',
        'src/components/GitHubExportModal.tsx',
      ];

      for (const filePath of filesToFetch) {
        try {
          const res = await fetch(`/${filePath}`);
          if (res.ok) {
            const content = await res.text();
            zip.file(filePath, content);
          }
        } catch {
          // continue
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Add Project to Your GitHub</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Git Initialized
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Local git repository is already initialized with a clean initial commit and complete README.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Repository Configuration */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-300">Your GitHub Username</label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g. octocat"
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300">Repository Name</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="password-strength-analyzer"
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Quick link to create repo */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Step 1: Create an empty repository on GitHub
            </span>
            <a
              href={`https://github.com/new?name=${encodeURIComponent(repoName)}&description=${encodeURIComponent('Cybersecurity Password Strength Analyzer virtual internship project')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md font-medium transition-colors"
            >
              <span>Create on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Method A: Direct Git Push Commands */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Step 2: Push via Terminal (Recommended)</span>
            </div>
            <button
              onClick={() => handleCopy(fullCommandString, 99)}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copiedIndex === 99 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 99 ? 'Copied All' : 'Copy All Commands'}</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
            {commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <span className="text-slate-300">
                  <span className="text-cyan-500 mr-2">$</span>
                  {cmd}
                </span>
                <button
                  onClick={() => handleCopy(cmd, idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                  title="Copy command"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>

          {/* GitHub CLI shortcut */}
          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-500 text-[11px]">Or with GitHub CLI:</span>
              <span className="text-cyan-300 truncate">{ghCliCommand}</span>
            </div>
            <button
              onClick={() => handleCopy(ghCliCommand, 88)}
              className="text-slate-400 hover:text-white p-1"
              title="Copy gh command"
            >
              {copiedIndex === 88 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Method B: Download ZIP */}
        <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <FolderArchive className="w-4 h-4 text-cyan-400" />
              <span>Alternative: Download Project ZIP</span>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Packaging...' : zipSuccess ? 'Downloaded!' : 'Download ZIP'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Download all project source files, README, dependencies, and configuration packed in a ready-to-upload ZIP.
          </p>
        </div>

        {/* Ready to go badge */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Default branch: <strong className="text-slate-200">main</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
