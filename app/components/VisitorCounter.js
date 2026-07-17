'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const NE_STANDARD_ORDER = ['AR', 'AS', 'MN', 'ML', 'MZ', 'NL', 'SK', 'TR'];

const STATE_ICONS = {
  AR: '🏔️', // Arunachal Pradesh - mountains
  AS: '🦏', // Assam - rhino
  MN: '💃', // Manipur - dance
  ML: '🌧️', // Meghalaya - rain
  MZ: '🎋', // Mizoram - bamboo
  NL: '🦅', // Nagaland - hornbill
  SK: '🏔️', // Sikkim - mountains
  TR: '🌿', // Tripura - greenery
};

const VISITOR_COUNTED_KEY = 'nest_visitor_counted';

function AnimatedNumber({ value, shouldAnimate }) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(startValue + (value - startValue) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, shouldAnimate]);

  return <span>{displayValue.toLocaleString()}</span>;
}

function SkeletonLoader() {
  return (
    <div className="visitor-counter-section">
      <div className="container">
        <div className="text-center mb-8">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
        </div>
        <div className="visitor-total-card">
          <div className="skeleton-line skeleton-total" />
        </div>
        <div className="visitor-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="visitor-state-card">
              <div className="skeleton-line skeleton-state" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VisitorCounter() {
  const [states, setStates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('count'); // 'count' or 'standard'
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  // Fetch / record visit
  useEffect(() => {
    async function recordVisit() {
      try {
        const res = await fetch('/api/visitors', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to record visit');
        const data = await res.json();

        setStates(data.states || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Visitor counter error:', err);
        setError('Unable to load visitor data');
        // Try a plain GET as fallback
        try {
          const res = await fetch('/api/visitors');
          if (res.ok) {
            const data = await res.json();
            setStates(data.states || []);
            setTotal(data.total || 0);
            setError(null);
          }
        } catch {
          // Silently fail
        }
      } finally {
        setLoading(false);
      }
    }

    recordVisit();
  }, []);

  const sortedStates = useCallback(() => {
    if (sortBy === 'standard') {
      return [...states].sort(
        (a, b) =>
          NE_STANDARD_ORDER.indexOf(a.stateCode) -
          NE_STANDARD_ORDER.indexOf(b.stateCode)
      );
    }
    // By count (descending) — already sorted from API
    return [...states].sort((a, b) => b.count - a.count);
  }, [states, sortBy]);

  if (loading) return <SkeletonLoader />;

  if (error && states.length === 0) {
    return null; // Gracefully hide on total failure
  }

  const sorted = sortedStates();
  const maxCount = Math.max(...sorted.map((s) => s.count), 1);

  return (
    <section
      ref={sectionRef}
      className="visitor-counter-section section"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="container">
        <div className="text-center mb-8">
          <h2>Visitors from Northeast India</h2>
          <p className="text-muted mt-2">
            Tracking engagement across the eight northeastern states
          </p>
        </div>

        {/* Total count */}
        <div className="visitor-total-card">
          <div className="visitor-total-icon">📍</div>
          <div className="visitor-total-number">
            <AnimatedNumber value={total} shouldAnimate={isVisible} />
          </div>
          <div className="visitor-total-label">Total Visitors</div>
        </div>

        {/* Sort toggle */}
        <div className="visitor-sort-toggle">
          <button
            className={`visitor-sort-btn ${sortBy === 'count' ? 'active' : ''}`}
            onClick={() => setSortBy('count')}
          >
            By Count
          </button>
          <button
            className={`visitor-sort-btn ${sortBy === 'standard' ? 'active' : ''}`}
            onClick={() => setSortBy('standard')}
          >
            Standard Order
          </button>
        </div>

        {/* State grid */}
        <div className="visitor-grid">
          {sorted.map((state, index) => (
            <div
              key={state.stateCode}
              className={`visitor-state-card ${isVisible ? 'animate-in' : ''}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="visitor-state-icon">
                {STATE_ICONS[state.stateCode] || '📍'}
              </div>
              <div className="visitor-state-info">
                <div className="visitor-state-name">{state.stateName}</div>
                <div className="visitor-state-count">
                  <AnimatedNumber
                    value={state.count}
                    shouldAnimate={isVisible}
                  />
                </div>
              </div>
              <div className="visitor-state-bar-track">
                <div
                  className="visitor-state-bar-fill"
                  style={{
                    width: isVisible
                      ? `${Math.max((state.count / maxCount) * 100, 4)}%`
                      : '0%',
                    transitionDelay: `${index * 80 + 300}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <p
            className="text-muted text-center mt-4"
            style={{ fontSize: '0.8rem', opacity: 0.6 }}
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
