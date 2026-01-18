
import React, { useState } from 'react';
import { Newsletter, EntityType } from '../types';
import { ENTITIES } from '../constants';

// Icons
const CheckCircle = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const AlertCircle = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const TrendingUp = () => <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
const TrendingDown = () => <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>;
const DownloadIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
const MarkdownIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h10M7 16h10M7 8h2"></path></svg>;

interface NewsletterPreviewProps {
  newsletter: Newsletter;
}

const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({ newsletter }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const getEntityName = (id: string) => ENTITIES.find(e => e.id === id)?.name || id;

  const calculateVariance = (actual: number, target: number) => {
    if (!target) return '0.0';
    return (((actual - target) / target) * 100).toFixed(1);
  };

  const generateMarkdown = () => {
    let md = `# Mvuvi Group - Weekly Executive Summary\n\n`;
    md += `**Week Ending:** ${newsletter.weekEnding} | **Week:** ${newsletter.weekNumber} | **Year:** ${newsletter.year}\n\n`;
    
    md += `## Executive Overview\n\n${newsletter.executiveSummary}\n\n`;
    
    md += `## Operations Snapshot\n\n`;
    md += `| Entity | Status | Revenue | Target | Variance | Key Metrics | Win | Challenge |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    
    newsletter.data.forEach(entity => {
      const name = getEntityName(entity.entityId);
      const variance = calculateVariance(entity.kpis.revenue, entity.kpis.revenueTarget);
      const metrics = entity.kpis.production 
        ? `Prod: ${entity.kpis.production}t, Mort: ${entity.kpis.mortality}%` 
        : `Sales: ${entity.kpis.salesVolume}t, Full: ${entity.kpis.fulfillmentRate}%`;
      
      md += `| ${name} | ${entity.status.toUpperCase()} | $${(entity.kpis.revenue / 1000).toFixed(0)}K | $${(entity.kpis.revenueTarget / 1000).toFixed(0)}K | ${variance}% | ${metrics} | ${entity.operational.win} | ${entity.operational.challenge} |\n`;
    });
    
    md += `\n## Group Financials\n\n`;
    md += `- **Opening Cash Position:** $${(newsletter.cashflow.opening / 1000).toFixed(0)}K\n`;
    md += `- **Weekly Inflow:** +$${(newsletter.cashflow.cashIn / 1000).toFixed(0)}K\n`;
    md += `- **Weekly Outflow:** -$${(newsletter.cashflow.cashOut / 1000).toFixed(0)}K\n`;
    md += `- **Closing Cash Position:** **$${(newsletter.cashflow.closing / 1000).toFixed(0)}K**\n\n`;
    
    md += `### Receivables Aging\n\n`;
    md += `- **30-60 Days:** $${(newsletter.cashflow.receivables30 / 1000).toFixed(0)}K\n`;
    md += `- **60+ Days:** $${(newsletter.cashflow.receivables60 / 1000).toFixed(0)}K\n\n`;
    
    md += `## Priorities & Support\n\n`;
    md += `### Top Priorities\n\n`;
    newsletter.priorities.forEach(p => md += `- ${p}\n`);
    md += `\n### Executive Support Required\n\n`;
    newsletter.supportRequired.forEach(s => md += `- ${s}\n`);
    
    md += `\n## ESMS & Social Impact\n\n`;
    md += `### Social Impact\n\n`;
    newsletter.esms.social.forEach(s => md += `- ${s}\n`);
    md += `\n### Environmental\n\n`;
    newsletter.esms.environmental.forEach(e => md += `- ${e}\n`);
    
    md += `\n---\n*Confidential - Mvuvi Group Executive Intelligence Suite*`;
    
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      amber: 'bg-amber-100 text-yellow-800 border-amber-300',
      red: 'bg-rose-100 text-rose-800 border-rose-300'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-wider ${colors[status as keyof typeof colors]}`}>
        {status === 'green' ? <CheckCircle /> : <AlertCircle />}
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden print:shadow-none print:border print:rounded-none transition-all">
      {/* Action Bar (No Print) */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-end gap-3 no-print">
        <button 
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg"
        >
          <MarkdownIcon />
          {copyStatus || 'Copy Markdown'}
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-200"
        >
          <DownloadIcon />
          Export to PDF
        </button>
      </div>

      {/* Header */}
      <div className="bg-slate-900 text-white p-10 flex justify-between items-center border-b-4 border-emerald-500">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1 text-white">Weekly Executive Summary</h1>
          <p className="text-emerald-400 font-medium tracking-widest uppercase text-xs">Mvuvi Group Holdings</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Week Ending</p>
          <p className="text-2xl font-mono font-bold">{newsletter.weekEnding}</p>
        </div>
      </div>

      <div className="p-10 space-y-10">
        {/* Executive Overview */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Executive Overview
          </h2>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
            {newsletter.executiveSummary}
          </div>
        </section>

        {/* Operations Snapshot */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
            Operations Snapshot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletter.data.map((entity) => (
              <div key={entity.entityId} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{getEntityName(entity.entityId)}</h3>
                  <StatusBadge status={entity.status} />
                </div>
                
                <div className="space-y-2.5 mb-5 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                    <span className="text-slate-500">Revenue:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      ${(entity.kpis.revenue / 1000).toFixed(0)}K
                      {entity.kpis.revenue >= entity.kpis.revenueTarget ? <TrendingUp /> : <TrendingDown />}
                      <span className={`text-[10px] ${entity.kpis.revenue >= entity.kpis.revenueTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                        ({calculateVariance(entity.kpis.revenue, entity.kpis.revenueTarget)}%)
                      </span>
                    </span>
                  </div>

                  {entity.kpis.production !== undefined && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Production:</span>
                        <span className="font-bold">{entity.kpis.production}t / {entity.kpis.productionTarget}t</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Mortality:</span>
                        <span className={`font-bold ${(entity.kpis.mortality || 0) > 2.5 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {entity.kpis.mortality}%
                        </span>
                      </div>
                    </>
                  )}

                  {entity.kpis.salesVolume !== undefined && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Sales Volume:</span>
                        <span className="font-bold">{entity.kpis.salesVolume}t / {entity.kpis.salesTarget}t</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Fulfillment:</span>
                        <span className="font-bold">{entity.kpis.fulfillmentRate}%</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest block mb-1">Win</span>
                    <p className="text-xs text-slate-700 leading-tight">{entity.operational.win}</p>
                  </div>
                  <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/50">
                    <span className="text-[10px] font-black uppercase text-rose-700 tracking-widest block mb-1">Challenge</span>
                    <p className="text-xs text-slate-700 leading-tight">{entity.operational.challenge}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cashflow & Receivables */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            Cashflow & Group Financials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-600 font-semibold">Opening Cash:</span>
                <span className="text-2xl font-bold text-slate-900">${(newsletter.cashflow.opening / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                <span className="font-semibold">Weekly Inflow:</span>
                <span className="text-2xl font-bold">+${(newsletter.cashflow.cashIn / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-800">
                <span className="font-semibold">Weekly Outflow:</span>
                <span className="text-2xl font-bold">-${(newsletter.cashflow.cashOut / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center p-5 bg-blue-600 rounded-xl border-2 border-blue-400 text-white shadow-xl shadow-blue-200">
                <span className="font-bold text-blue-100">Closing Position:</span>
                <span className="text-3xl font-bold">${(newsletter.cashflow.closing / 1000).toFixed(0)}K</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertCircle /> Receivables Aging
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-amber-200/50 pb-2">
                    <span className="text-amber-800 text-sm">30-60 Days:</span>
                    <span className="font-mono font-bold text-amber-900 text-xl">${(newsletter.cashflow.receivables30 / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-rose-800 text-sm font-bold">60+ Days (Critical):</span>
                    <span className="font-mono font-bold text-rose-900 text-xl">${(newsletter.cashflow.receivables60 / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 text-white rounded-xl p-6">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">ESMS & Social Impact Notes</h3>
                <div className="space-y-3">
                  {newsletter.esms.social.slice(0, 2).map((note, i) => (
                    <div key={i} className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="text-slate-300">{note}</span>
                    </div>
                  ))}
                  {newsletter.esms.environmental.slice(0, 1).map((note, i) => (
                    <div key={i} className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-blue-400 font-bold">•</span>
                      <span className="text-slate-300">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Priorities & Support */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-slate-900 rounded-full"></span>
              Top Priorities: Next Week
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {newsletter.priorities.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-emerald-600 font-black">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-rose-200 rounded-xl p-6 shadow-sm ring-2 ring-rose-50 ring-offset-2">
            <h2 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
              Executive Support Required
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              {newsletter.supportRequired.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-rose-600 font-black">!</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Confidential — Executive Eyes Only</p>
        <p className="text-xs text-slate-500">Generated via Mvuvi Group Executive Intelligence Suite &copy; {newsletter.year}</p>
      </div>
    </div>
  );
};

export default NewsletterPreview;
