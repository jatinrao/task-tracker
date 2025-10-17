import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const Header= React.memo<HeaderProps>(({ title="Interactive Dashboard", subtitle="Click chart segments or bars to filter the data table. Multiple selections within the same chart use OR logic; selections across different charts use AND logic." }) => {
  return (
    <div className="bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-2">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500">{title}</h1>
              <h2 className="text-sm text-gray-600 leading-tight max-w-4xl">
                {subtitle}
              </h2>
            </div>
          </div>
        </div>
      </div>
  );
});

Header.displayName = 'Header';
