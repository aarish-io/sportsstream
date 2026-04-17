import React, { useEffect, useMemo, useState } from 'react';
import { useMatchData } from './hooks/useMatchData.ts';
import { MatchCard } from './components/MatchCard.tsx';
import { LiveFeed } from './components/LiveFeed.tsx';
import { StatusIndicator } from './components/StatusIndicator.tsx';
import { API_BASE_URL, WS_BASE_URL } from './constants.ts';

const App: React.FC = () => {
  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    matches,
    isLoading,
    error,
    commentary,
    isCommentaryLoading,
    wsError,
    status,
    activeMatchId,
    newMatchesCount,
    dismissNewMatches,
    watchMatch,
    unwatchMatch,
    reloadMatches,
  } = useMatchData();

  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return matches.slice(startIndex, startIndex + pageSize);
  }, [matches, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/30 to-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-orange-200/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">⚽ SportsStream</h1>
            <p className="text-sm text-stone-600 mt-0.5">Live coverage • Real-time updates</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <StatusIndicator status={status} />
            {wsError && (
              <span className="text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-md">
                ⚠️ {wsError}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Match List */}
          <main className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">🔴 Matches</h2>
              <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full border border-amber-300">
                {isLoading ? 'Loading...' : `${matches.length} active`}
              </span>
            </div>

            {newMatchesCount > 0 && (
              <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-300 rounded-lg px-4 py-3">
                <span className="text-sm font-semibold text-green-700">
                  ✨ {newMatchesCount} new match{newMatchesCount > 1 ? 'es' : ''} added
                </span>
                <button
                  onClick={dismissNewMatches}
                  className="px-3 py-1 rounded text-xs font-medium bg-green-200 hover:bg-green-300 transition-colors text-green-800"
                >
                  Dismiss
                </button>
              </div>
            )}

            {isLoading && (
              <div className="p-12 text-center border-2 border-dashed border-stone-300 rounded-lg bg-stone-100/50">
                <div className="animate-spin w-8 h-8 border-3 border-amber-300 border-t-amber-600 rounded-full mx-auto mb-4"></div>
                <p className="font-medium text-stone-600">Loading matches...</p>
              </div>
            )}

            {error && (
               <div className="bg-red-50 border border-red-300 text-red-900 p-6 rounded-lg text-center">
                  <div className="flex justify-center mb-3 text-3xl">⚠️</div>
                  <h3 className="text-lg font-bold mb-1">Connection Error</h3>
                  <p className="font-mono text-sm bg-red-100 py-2 px-3 rounded inline-block mb-4 border border-red-200">{error}</p>
                  <p className="text-sm text-red-800 mb-6">
                    Make sure the backend is running on {API_BASE_URL}
                  </p>
                  <button
                    onClick={reloadMatches}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    🔄 Retry Connection
                  </button>
               </div>
            )}

            {!isLoading && !error && matches.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-stone-300 rounded-lg bg-stone-100/50">
                <p className="font-medium text-stone-600 text-lg">📭 No matches found</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  // eslint-disable-next-line eqeqeq
                  isActive={activeMatchId == match.id}
                  onWatch={watchMatch}
                  onUnwatch={unwatchMatch}
                />
              ))}
            </div>

            {!isLoading && !error && matches.length > pageSize && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
                <span className="text-xs font-medium text-stone-600">
                  Page <span className="font-bold text-orange-700">{currentPage}</span> of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === 1 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
                    }`}
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === totalPages 
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Right Column: Live Feed */}
          <aside className="lg:col-span-1 h-[500px] lg:h-[calc(100vh-180px)] lg:sticky lg:top-24">
            <div className="bg-white rounded-lg border border-orange-200/50 shadow-sm h-full flex flex-col">
              <LiveFeed messages={commentary} isActive={!!activeMatchId} isLoading={isCommentaryLoading} />
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-orange-200/50 mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-stone-200/50">
            <h3 className="font-bold text-sm text-stone-900 mb-3">📋 Quick Info</h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-stone-600">
              <p><span className="font-medium text-stone-900">API:</span> {API_BASE_URL}</p>
              <p><span className="font-medium text-stone-900">Status:</span> {status === 'connected' ? '✅ Connected' : '⏳ ' + status}</p>
              <p><span className="font-medium text-stone-900">Matches:</span> {matches.length}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

