// UserStatsContext — balance, coins, lightning, streak with persistence and animations
import { createContext, useContext, useState, useCallback, useRef } from 'react';

const UserStatsContext = createContext(null);

const DEFAULT_STATS = {
  balance: 12500,
  coins: 340,
  lightning: 87,
  streak: 7,
};

export function UserStatsProvider({ children }) {
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem('marsit_stats');
      return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
    } catch { return DEFAULT_STATS; }
  });

  // Tracks which stat is currently animating (for coin-pop effect)
  const [animating, setAnimating] = useState({});
  const animTimers = useRef({});

  function persist(newStats) {
    localStorage.setItem('marsit_stats', JSON.stringify(newStats));
  }

  /**
   * Trigger a pop animation on a specific stat key
   */
  function triggerAnim(key) {
    setAnimating(prev => ({ ...prev, [key]: true }));
    clearTimeout(animTimers.current[key]);
    animTimers.current[key] = setTimeout(() => {
      setAnimating(prev => ({ ...prev, [key]: false }));
    }, 400);
  }

  const addCoins = useCallback((amount) => {
    setStats(prev => {
      const next = { ...prev, coins: prev.coins + amount };
      persist(next);
      return next;
    });
    triggerAnim('coins');
  }, []);

  const addLightning = useCallback((amount) => {
    setStats(prev => {
      const next = { ...prev, lightning: prev.lightning + amount };
      persist(next);
      return next;
    });
    triggerAnim('lightning');
  }, []);

  const addBalance = useCallback((amount) => {
    setStats(prev => {
      const next = { ...prev, balance: prev.balance + amount };
      persist(next);
      return next;
    });
    triggerAnim('balance');
  }, []);

  const incrementStreak = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, streak: prev.streak + 1 };
      persist(next);
      return next;
    });
    triggerAnim('streak');
  }, []);

  return (
    <UserStatsContext.Provider value={{
      stats,
      animating,
      addCoins,
      addLightning,
      addBalance,
      incrementStreak,
    }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) throw new Error('useUserStats must be used within UserStatsProvider');
  return ctx;
}

