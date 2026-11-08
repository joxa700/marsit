// UserStatsContext — per-user balance, coins, lightning, streak, wins
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserStatsContext = createContext(null);

const DEFAULT_STATS = {
  balance: 0,
  coins: 0,
  lightning: 0,
  streak: 0,
  wins: 0,
  level: 1,
  xp: 0,
};

function storageKeyFor(user) {
  const id = user?.id || user?.email || 'guest';
  return `marsit_stats_${id}`;
}

function loadStats(key) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : { ...DEFAULT_STATS };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function UserStatsProvider({ children }) {
  const { user } = useAuth();
  const storageKey = storageKeyFor(user);
  const keyRef = useRef(storageKey);

  const [stats, setStats] = useState(() => loadStats(storageKey));

  // Har bir foydalanuvchi uchun alohida saqlangan statistika
  useEffect(() => {
    keyRef.current = storageKey;
    setStats(loadStats(storageKey));
  }, [storageKey]);

  // Tracks which stat is currently animating (for coin-pop effect)
  const [animating, setAnimating] = useState({});
  const animTimers = useRef({});

  function persist(newStats) {
    try {
      localStorage.setItem(keyRef.current, JSON.stringify(newStats));
    } catch {
      // localStorage mavjud bo'lmasa jim o'tamiz
    }
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

  const addWins = useCallback((amount = 1) => {
    setStats(prev => {
      const next = { ...prev, wins: prev.wins + amount };
      persist(next);
      return next;
    });
  }, []);

  return (
    <UserStatsContext.Provider value={{
      stats,
      animating,
      addCoins,
      addLightning,
      addBalance,
      incrementStreak,
      addWins,
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
