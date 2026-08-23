import React from 'react';
import { Home, BarChart3, User, MessageSquareCode } from 'lucide-react';

export type NavTab = 'home' | 'analytics' | 'support' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  transactionCount: number;
}

export function BottomNav({ activeTab, onSelectTab, transactionCount }: BottomNavProps) {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'হিসাব খাতা',
      icon: Home,
      badge: transactionCount > 0 ? transactionCount : undefined
    },
    {
      id: 'analytics' as NavTab,
      label: 'রিপোর্ট',
      icon: BarChart3,
    },
    {
      id: 'support' as NavTab,
      label: 'সাপোর্ট',
      icon: MessageSquareCode,
    },
    {
      id: 'profile' as NavTab,
      label: 'প্রোফাইল',
      icon: User,
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 sm:px-4 py-1.5 safe-nav-pb shadow-2xl transition-all">
      <div className="max-w-xl mx-auto w-full flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-2.5 sm:px-3 rounded-2xl transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group cursor-pointer active:scale-95 flex-1 max-w-[85px]"
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105'
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
                <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2]" />
              </div>
              
              <span className={`text-[9px] sm:text-[10px] font-bold tracking-tight transition-colors truncate max-w-full ${
                isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'
              }`}>
                {tab.label}
              </span>

              {/* Red/Indigo Indicator Badge if present */}
              {tab.badge !== undefined && (
                <span className="absolute top-1 right-2 sm:right-3 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow-sm">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
