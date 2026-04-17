import React, { useEffect, useRef, useState } from 'react';
import { Match } from '../types.ts';

interface MatchCardProps {
  match: Match;
  isActive: boolean;
  onWatch: (id: string | number) => void;
  onUnwatch: (id: string | number) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, isActive, onWatch, onUnwatch }) => {
  // Handle case-insensitive status check from API
  const statusLower = match.status.toLowerCase();
  const isLive = statusLower === 'live';
  const [homePulse, setHomePulse] = useState(false);
  const [awayPulse, setAwayPulse] = useState(false);
  const prevScoreRef = useRef({ home: match.homeScore, away: match.awayScore });
  const pulseTimeoutRef = useRef<{ home?: ReturnType<typeof setTimeout>; away?: ReturnType<typeof setTimeout> }>({});
  
  const actionLabel = (() => {
    if (isLive) {
      return isActive ? 'Watching Live' : 'Watch Live';
    }
    if (statusLower === 'finished') {
      return isActive ? 'Viewing Recap' : 'View Recap';
    }
    return isActive ? 'Viewing Match' : 'View Match';
  })();

  useEffect(() => {
    const prevScore = prevScoreRef.current;
    const homeChanged = prevScore.home !== match.homeScore;
    const awayChanged = prevScore.away !== match.awayScore;

    if (homeChanged) {
      setHomePulse(true);
      if (pulseTimeoutRef.current.home) {
        clearTimeout(pulseTimeoutRef.current.home);
      }
      pulseTimeoutRef.current.home = setTimeout(() => {
        setHomePulse(false);
      }, 900);
    }

    if (awayChanged) {
      setAwayPulse(true);
      if (pulseTimeoutRef.current.away) {
        clearTimeout(pulseTimeoutRef.current.away);
      }
      pulseTimeoutRef.current.away = setTimeout(() => {
        setAwayPulse(false);
      }, 900);
    }

    prevScoreRef.current = { home: match.homeScore, away: match.awayScore };

    return () => {
      if (pulseTimeoutRef.current.home) {
        clearTimeout(pulseTimeoutRef.current.home);
      }
      if (pulseTimeoutRef.current.away) {
        clearTimeout(pulseTimeoutRef.current.away);
      }
    };
  }, [match.homeScore, match.awayScore]);
  
  // Format status for display (Capitalize first letter)
  const displayStatus = match.status.charAt(0).toUpperCase() + match.status.slice(1).toLowerCase();

  return (
    <div className={`
      relative p-5 rounded-xl border bg-white transition-all duration-200
      ${isActive ? 'border-orange-300 shadow-md ring-2 ring-orange-100' : 'border-stone-200 hover:shadow-sm hover:border-stone-300'}
    `}>
      {/* Header: Sport & Status */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 border border-stone-200 rounded-full px-2 py-0.5">
          {match.sport}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className={`text-sm font-medium ${isLive ? 'text-red-600' : 'text-stone-600'}`}>
            {displayStatus}
          </span>
        </div>
      </div>

      {/* Teams & Score */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-stone-900 line-clamp-1">{match.homeTeam}</span>
          <span
            className={`
              font-semibold text-2xl border rounded-lg px-3 py-1 min-w-[3rem] text-center transition-colors
              ${homePulse ? 'bg-amber-200 border-amber-300 animate-pulse' : 'bg-stone-100 border-stone-200'}
            `}
          >
            {match.homeScore}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-stone-900 line-clamp-1">{match.awayTeam}</span>
          <span
            className={`
              font-semibold text-2xl border rounded-lg px-3 py-1 min-w-[3rem] text-center transition-colors
              ${awayPulse ? 'bg-amber-200 border-amber-300 animate-pulse' : 'bg-stone-100 border-stone-200'}
            `}
          >
            {match.awayScore}
          </span>
        </div>
      </div>

      {/* Footer: Action */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-200">
        <span className="text-xs text-stone-500 font-medium">
          {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onWatch(match.id)}
            disabled={isActive}
            className={`
              px-4 py-2 rounded-md font-semibold text-sm border transition-all
              ${isActive 
                ? 'bg-orange-100 text-orange-800 border-orange-200 cursor-default' 
                : 'bg-stone-900 text-white border-stone-900 hover:bg-stone-700'
              }
            `}
          >
            {actionLabel}
          </button>
          {isActive && (
            <button
              onClick={() => onUnwatch(match.id)}
              className="px-3 py-2 rounded-md font-semibold text-xs border border-stone-300 bg-white hover:bg-stone-50 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
