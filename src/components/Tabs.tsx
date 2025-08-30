'use client';

import React from 'react';

interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div
      className="flex border-b border-gray-700 mb-4"
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab}`}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 
              ${
                isActive
                  ? 'border-b-2 border-blue-400 text-blue-400 bg-blue-400/10 rounded-t-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/40 rounded-t-md'
              }`}
            onClick={() => onChange(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
