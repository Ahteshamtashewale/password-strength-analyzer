import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  Shield,
  Clock,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
} from 'lucide-react';
import { AuditLogEntry, AuditSeverity } from '../types/security';

interface AuditLoggerProps {
  logs: AuditLogEntry[];
  onClearLogs: () => void;
}

export const AuditLogger: React.FC<AuditLoggerProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const filteredLogs = logs.filter((entry) => {
    const matchesSeverity =
      selectedSeverity === 'ALL' || entry.severity === selectedSeverity;
    const matchesSearch =
      searchTerm === '' ||
      entry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.sha256Prefix.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `security_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['id', 'timestamp', 'eventType', 'severity', 'inputLength', 'sha256Prefix', 'message', 'details', 'executionTimeMs'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      l.eventType,
      l.severity,
      l.inputLength,
      l.sha256Prefix,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.executionTimeMs
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `security_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case 'WARN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            WARN
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            PASS
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            <Info className="w-3 h-3 text-cyan-400" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <span>Security Audit & Compliance Event Logging</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise logging engine capturing validation events, cryptographic hashes, entropy calculations, and breach queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg hover:bg-rose-900/40 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Zero Knowledge Privacy Notice */}
      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3 text-xs leading-relaxed text-slate-300">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Zero-Knowledge Audit Standard:</strong> In compliance with security and privacy requirements (ISO/IEC 27001 & NIST 800-53), plaintext passwords are strictly prohibited from being persisted in telemetry logs. Instead, all entries record a truncated SHA-256 digest fingerprint and masked string length.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event type, fingerprint, or message..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Severity Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'INFO', 'SUCCESS', 'WARN', 'CRITICAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded transition-colors font-medium ${
                  selectedSeverity === sev
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Log Counter Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span>Showing {filteredLogs.length} of {logs.length} logged events</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">{logs.filter(l => l.severity === 'CRITICAL').length} Critical</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-400">{logs.filter(l => l.severity === 'WARN').length} Warnings</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            Live Event Stream
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Event ID</th>
                <th className="py-2.5 px-3 font-semibold">Stage</th>
                <th className="py-2.5 px-3 font-semibold">Severity</th>
                <th className="py-2.5 px-3 font-semibold">Digest Fingerprint</th>
                <th className="py-2.5 px-3 font-semibold">Audit Findings</th>
                <th className="py-2.5 px-3 font-semibold text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    No security audit events match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap tabular-nums">
                      {entry.timestamp.split('T')[1]?.replace('Z', '') || entry.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400 text-[11px] whitespace-nowrap">
                      {entry.id}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-white text-[11px] whitespace-nowrap">
                      {entry.eventType}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                      {renderSeverityBadge(entry.severity)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                      <span className="text-slate-500">sha256:</span>
                      <span className="text-slate-300 ml-1">{entry.sha256Prefix}</span>
                      <span className="ml-2 text-slate-500 text-[10px]">({entry.maskedInput})</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-200 max-w-md">
                      <div className="font-medium text-slate-200">{entry.message}</div>
                      {entry.details && (
                        <div className="text-[11px] text-slate-400 mt-0.5 font-sans leading-tight">
                          {entry.details}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 text-[11px] tabular-nums whitespace-nowrap">
                      {entry.executionTimeMs} ms
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
