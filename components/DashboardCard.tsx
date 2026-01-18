
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'emerald' | 'rose' | 'amber';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50/50 text-blue-700 border-blue-100/50',
    emerald: 'bg-emerald-50/50 text-emerald-700 border-emerald-100/50',
    rose: 'bg-rose-50/50 text-rose-700 border-rose-100/50',
    amber: 'bg-amber-50/50 text-amber-700 border-amber-100/50',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]} shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-1`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{title}</span>
        <div className="opacity-40">{icon}</div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className={`text-xs font-bold mb-1 flex items-center ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}
          </div>
        )}
      </div>
      {subtitle && <div className="text-xs mt-2 opacity-60 font-medium">{subtitle}</div>}
      
      {/* Decorative Sparkline */}
      <div className="mt-4 h-1 w-full bg-current opacity-10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-current opacity-40 rounded-full" 
          style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DashboardCard;
