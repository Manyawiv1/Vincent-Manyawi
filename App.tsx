
import React, { useState } from 'react';
import { ENTITIES } from './constants';
import { Newsletter, WeeklyData, EntityType } from './types';
import NewsletterPreview from './components/NewsletterPreview';
import DashboardCard from './components/DashboardCard';
import { generateExecutiveSummary } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [newsletter, setNewsletter] = useState<Newsletter>({
    weekNumber: 3,
    year: 2026,
    weekEnding: '2026-01-17',
    executiveSummary: "Pending generation...",
    data: ENTITIES.map(entity => ({
      entityId: entity.id,
      status: 'green',
      kpis: {
        revenue: entity.type === EntityType.FARM ? 45000 : 95000,
        revenueTarget: entity.type === EntityType.FARM ? 50000 : 90000,
        production: entity.type === EntityType.FARM ? 12.5 : undefined,
        productionTarget: entity.type === EntityType.FARM ? 13.0 : undefined,
        mortality: entity.type === EntityType.FARM ? 2.1 : undefined,
        fcr: entity.type === EntityType.FARM ? 1.45 : undefined,
        salesVolume: entity.type === EntityType.DISTRIBUTION ? 28.5 : undefined,
        salesTarget: entity.type === EntityType.DISTRIBUTION ? 27.0 : undefined,
        fulfillmentRate: entity.type === EntityType.DISTRIBUTION ? 96 : undefined,
      },
      operational: {
        win: 'On-schedule operations maintained.',
        challenge: 'Minor logistics delays noted.',
      }
    })),
    cashflow: {
      opening: 1250000,
      cashIn: 292000,
      cashOut: 315000,
      closing: 1227000,
      receivables30: 145000,
      receivables60: 38000,
    },
    priorities: [
      'Resolve cross-border feed logistics for Chicoa.',
      'Finalize cold storage expansion in Harare for Lake Harvest Distribution.',
      'Improve fulfillment in Pende Malawi hub.'
    ],
    supportRequired: [
      'Approve $45K Capex for solar aeration at Kariba Harvest hub.',
      'Review alternate feed supplier contracts for Q2.'
    ],
    esms: {
      environmental: ['Water quality within ISO standards.', 'Effluent monitoring systems calibrated.'],
      social: ['Zero LTIs (Lost Time Injuries) recorded.', 'Community outreach in Beira launched.'],
      compliance: ['All licensing up to date.']
    }
  });

  const updateEntityData = (idx: number, updates: Partial<WeeklyData>) => {
    const newData = [...newsletter.data];
    newData[idx] = { ...newData[idx], ...updates };
    setNewsletter({ ...newsletter, data: newData });
  };

  const updateKPI = (idx: number, field: keyof WeeklyData['kpis'], val: number) => {
    const newData = [...newsletter.data];
    newData[idx].kpis = { ...newData[idx].kpis, [field]: val };
    setNewsletter({ ...newsletter, data: newData });
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const context = newsletter.data.map(d => {
      const e = ENTITIES.find(ent => ent.id === d.entityId);
      return `${e?.name}: Revenue $${d.kpis.revenue} vs $${d.kpis.revenueTarget}. Win: ${d.operational.win}. Challenge: ${d.operational.challenge}`;
    }).join('\n');

    try {
      const summary = await generateExecutiveSummary(context);
      setNewsletter({ ...newsletter, executiveSummary: summary });
      setActiveTab('preview');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-slate-900 text-white z-50 no-print flex flex-col items-center py-10">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black shadow-lg">M</div>
          <span className="hidden md:block font-bold text-xl tracking-tight">Mvuvi Pulse</span>
        </div>
        
        <nav className="w-full px-4 space-y-4">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === 'editor' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="text-xl">🛠️</span>
            <span className="hidden md:block font-bold">Input Center</span>
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === 'preview' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
          >
            <span className="text-xl">📑</span>
            <span className="hidden md:block font-bold">Preview Brief</span>
          </button>
        </nav>
        
        <div className="mt-auto px-4 w-full">
          <button onClick={() => window.print()} className="w-full flex items-center gap-4 p-4 rounded-xl text-slate-400 hover:text-white transition-all">
            <span>🖨️</span>
            <span className="hidden md:block font-bold">Export PDF</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-20 md:ml-64 p-8 md:p-16">
        {activeTab === 'editor' ? (
          <div className="max-w-6xl mx-auto space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Mvuvi Group Console</h1>
                <p className="text-slate-500 font-medium">Capture performance metrics for Week {newsletter.weekNumber}</p>
              </div>
              <button 
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isGenerating ? 'Synthesizing...' : 'Generate Executive Brief ✨'}
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard title="Group Net Cash" value={`$${(newsletter.cashflow.closing/1000).toFixed(0)}K`} color="blue" />
              <DashboardCard title="Revenue Alignment" value={`${((newsletter.data.reduce((a,b)=>a+b.kpis.revenue,0)/newsletter.data.reduce((a,b)=>a+b.kpis.revenueTarget,0))*100).toFixed(1)}%`} color="emerald" />
              <DashboardCard title="Safety Record" value="0 LTI" color="rose" subtitle="Zero incidents Group-wide" />
            </div>

            <div className="space-y-8">
              {newsletter.data.map((entity, idx) => (
                <div key={entity.entityId} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{ENTITIES.find(e => e.id === entity.entityId)?.name}</h3>
                      <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-6">{ENTITIES.find(e => e.id === entity.entityId)?.country}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Actual</label>
                          <input type="number" value={entity.kpis.revenue} onChange={e => updateKPI(idx, 'revenue', +e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Target</label>
                          <input type="number" value={entity.kpis.revenueTarget} onChange={e => updateKPI(idx, 'revenueTarget', +e.target.value)} className="w-full p-2 border rounded-lg font-bold" />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Status</label>
                          <select value={entity.status} onChange={e => updateEntityData(idx, { status: e.target.value as any })} className="w-full p-2 border rounded-lg font-bold">
                            <option value="green">Healthy (Green)</option>
                            <option value="amber">Caution (Amber)</option>
                            <option value="red">Critical (Red)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Primary Win</label>
                          <textarea 
                            value={entity.operational.win} 
                            onChange={e => updateEntityData(idx, { operational: { ...entity.operational, win: e.target.value } })}
                            className="w-full p-4 border rounded-xl text-sm leading-relaxed min-h-[100px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Top Challenge</label>
                          <textarea 
                            value={entity.operational.challenge} 
                            onChange={e => updateEntityData(idx, { operational: { ...entity.operational, challenge: e.target.value } })}
                            className="w-full p-4 border rounded-xl text-sm leading-relaxed min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial & Priority Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
              <div className="lg:col-span-1 bg-slate-900 text-white p-8 rounded-2xl space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Cashflow Control</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400">Opening Position</label>
                    <input type="number" value={newsletter.cashflow.opening} onChange={e => setNewsletter({...newsletter, cashflow: {...newsletter.cashflow, opening: +e.target.value}})} className="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-emerald-400">Cash In</label>
                      <input type="number" value={newsletter.cashflow.cashIn} onChange={e => setNewsletter({...newsletter, cashflow: {...newsletter.cashflow, cashIn: +e.target.value}})} className="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-rose-400">Cash Out</label>
                      <input type="number" value={newsletter.cashflow.cashOut} onChange={e => setNewsletter({...newsletter, cashflow: {...newsletter.cashflow, cashOut: +e.target.value}})} className="w-full bg-slate-800 p-2 rounded border border-slate-700 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-2xl space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Priorities & Support</h3>
                  <textarea 
                    value={newsletter.priorities.join('\n')}
                    onChange={e => setNewsletter({...newsletter, priorities: e.target.value.split('\n')})}
                    className="w-full p-4 bg-slate-50 border rounded-xl text-sm min-h-[120px]"
                    placeholder="Priorities (one per line)..."
                  />
                  <textarea 
                    value={newsletter.supportRequired.join('\n')}
                    onChange={e => setNewsletter({...newsletter, supportRequired: e.target.value.split('\n')})}
                    className="w-full p-4 border border-rose-100 bg-rose-50/20 rounded-xl text-sm min-h-[100px]"
                    placeholder="Support Required (one per line)..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in py-10">
            <NewsletterPreview newsletter={newsletter} />
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
