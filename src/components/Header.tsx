import React from 'react';
import { ShieldCheck, Play, FileCheck, ShieldAlert, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'auth-lab' | 'audit-logs' | 'awareness' | 'test-suite' | 'submission';
  setActiveTab: (tab: 'analyzer' | 'auth-lab' | 'audit-logs' | 'awareness' | 'test-suite' | 'submission') => void;
  onQuickRunTests: () => void;
  onOpenGitHubModal: () => void;
  testPassedCount: number;
  totalTests: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickRunTests,
  onOpenGitHubModal,
  testPassedCount,
  totalTests,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('analyzer');
              }}
              className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors"
            >
              CyberShield
            </a>
            <span className="hidden sm:inline text-xs text-slate-500 border-l border-slate-800 pl-3">
              Virtual Internship Lab
            </span>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'analyzer'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => setActiveTab('auth-lab')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'auth-lab'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auth Concepts
            </button>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'audit-logs'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('awareness')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'awareness'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Awareness
            </button>
            <button
              onClick={() => setActiveTab('test-suite')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'test-suite'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Testing Suite
              {testPassedCount > 0 && (
                <span className="ml-1.5 text-xs text-emerald-400 font-mono">
                  ({testPassedCount}/{totalTests})
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'submission'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Submission & Report
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGitHubModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap"
              title="Add this project to your GitHub"
            >
              <Github className="w-3.5 h-3.5 text-slate-300" />
              <span>GitHub</span>
            </button>
            <button
              onClick={onQuickRunTests}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap"
              title="Run automated cybersecurity test suite"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Run Tests</span>
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-all whitespace-nowrap shadow-sm shadow-cyan-500/20"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Project</span> Report
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {(['analyzer', 'auth-lab', 'audit-logs', 'awareness', 'test-suite', 'submission'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'analyzer' && 'Analyzer'}
                {tab === 'auth-lab' && 'Auth Lab'}
                {tab === 'audit-logs' && 'Audit Logs'}
                {tab === 'awareness' && 'Awareness'}
                {tab === 'test-suite' && 'Testing'}
                {tab === 'submission' && 'Submission'}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
