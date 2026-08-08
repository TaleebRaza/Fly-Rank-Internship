import React, { useState, useEffect, useMemo } from 'react';
import { Flight, FactorWeights, ScoredFlight, FactorScores } from './types';
import './App.css';

// Initial mock flights to populate the app with rich, diverse data
const INITIAL_FLIGHTS: Flight[] = [
  {
    id: 'f1',
    airline: 'Delta Air Lines',
    flightNumber: 'DL 242',
    price: 299,
    duration: 150, // 2h 30m
    stops: 0,
    rating: 4.6,
    baggageIncluded: true,
    departureTime: '08:00 AM',
    arrivalTime: '10:30 AM',
  },
  {
    id: 'f2',
    airline: 'United Airlines',
    flightNumber: 'UA 512',
    price: 189,
    duration: 290, // 4h 50m
    stops: 1,
    rating: 3.8,
    baggageIncluded: false,
    departureTime: '06:15 AM',
    arrivalTime: '11:05 AM',
  },
  {
    id: 'f3',
    airline: 'Spirit Airlines',
    flightNumber: 'NK 109',
    price: 89,
    duration: 310, // 5h 10m
    stops: 1,
    rating: 2.1,
    baggageIncluded: false,
    departureTime: '11:50 PM',
    arrivalTime: '05:00 AM',
  },
  {
    id: 'f4',
    airline: 'JetBlue Airways',
    flightNumber: 'B6 820',
    price: 350,
    duration: 160, // 2h 40m
    stops: 0,
    rating: 4.8,
    baggageIncluded: true,
    departureTime: '02:30 PM',
    arrivalTime: '05:10 PM',
  },
  {
    id: 'f5',
    airline: 'American Airlines',
    flightNumber: 'AA 204',
    price: 240,
    duration: 145, // 2h 25m
    stops: 0,
    rating: 4.1,
    baggageIncluded: true,
    departureTime: '09:15 AM',
    arrivalTime: '11:40 AM',
  },
];

// Presets for the weighting sliders
const PRESETS: Record<string, FactorWeights & { label: string }> = {
  balanced: {
    label: 'Balanced Choice',
    price: 3,
    duration: 3,
    stops: 3,
    rating: 3,
  },
  budget: {
    label: 'Budget First',
    price: 5,
    duration: 1,
    stops: 2,
    rating: 1,
  },
  business: {
    label: 'Business Traveler',
    price: 1,
    duration: 4,
    stops: 5,
    rating: 5,
  },
  timeSaver: {
    label: 'Time Saver',
    price: 2,
    duration: 5,
    stops: 4,
    rating: 2,
  },
};

// Default form state for adding/editing flights
const DEFAULT_FORM_STATE = {
  airline: 'Delta Air Lines',
  flightNumber: '',
  price: 250,
  durationHours: 2,
  durationMinutes: 30,
  stops: 0,
  rating: 4.0,
  baggageIncluded: true,
  departureTime: '09:00 AM',
  arrivalTime: '11:30 AM',
};

function App() {
  // ---------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ---------------------------------------------------------------------------
  const [flights, setFlights] = useState<Flight[]>(() => {
    const saved = localStorage.getItem('flyrank_flights');
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });

  const [weights, setWeights] = useState<FactorWeights>(() => {
    const saved = localStorage.getItem('flyrank_weights');
    return saved ? JSON.parse(saved) : PRESETS.balanced;
  });

  const [activePreset, setActivePreset] = useState<string>(() => {
    const saved = localStorage.getItem('flyrank_active_preset');
    return saved || 'balanced';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('flyrank_theme');
    return saved ? saved === 'dark' : true;
  });

  // Flight creation / editing states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);

  // ---------------------------------------------------------------------------
  // SYNC TO LOCAL STORAGE & APPLY THEME
  // ---------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('flyrank_flights', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('flyrank_weights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem('flyrank_active_preset', activePreset);
  }, [activePreset]);

  useEffect(() => {
    localStorage.setItem('flyrank_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // ---------------------------------------------------------------------------
  // AIRLINE STYLE MAPPER (AVATAR COLORS & INITIALS)
  // ---------------------------------------------------------------------------
  const getAirlineMeta = (airline: string) => {
    const cleanName = airline.toLowerCase();
    let bg = 'linear-gradient(135deg, #475569, #334155)'; // default slate
    let initials = airline.substring(0, 2).toUpperCase();

    if (cleanName.includes('delta')) {
      bg = 'linear-gradient(135deg, #e11d48, #1e3a8a)';
      initials = 'DL';
    } else if (cleanName.includes('united')) {
      bg = 'linear-gradient(135deg, #1d4ed8, #1e40af)';
      initials = 'UA';
    } else if (cleanName.includes('spirit')) {
      bg = 'linear-gradient(135deg, #eab308, #ca8a04)';
      initials = 'NK';
    } else if (cleanName.includes('jetblue') || cleanName.includes('jet blue')) {
      bg = 'linear-gradient(135deg, #06b6d4, #0369a1)';
      initials = 'B6';
    } else if (cleanName.includes('american')) {
      bg = 'linear-gradient(135deg, #3b82f6, #ef4444)';
      initials = 'AA';
    } else if (cleanName.includes('southwest')) {
      bg = 'linear-gradient(135deg, #f97316, #1d4ed8)';
      initials = 'WN';
    } else if (cleanName.includes('alaska')) {
      bg = 'linear-gradient(135deg, #0f172a, #047857)';
      initials = 'AS';
    } else if (cleanName.includes('frontier')) {
      bg = 'linear-gradient(135deg, #065f46, #047857)';
      initials = 'F9';
    }

    return { bg, initials };
  };

  // Helper to format minutes (e.g. 150 -> "2h 30m")
  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // ---------------------------------------------------------------------------
  // RANKING ALGORITHM (NORMALISED & WEIGHTED CALCULATIONS)
  // ---------------------------------------------------------------------------
  const scoredFlights = useMemo((): ScoredFlight[] => {
    if (flights.length === 0) return [];

    // 1. Find Min/Max boundaries for relative scales
    const prices = flights.map((f) => f.price);
    const durations = flights.map((f) => f.duration);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    // 2. Score and normalize each flight
    const calculated: ScoredFlight[] = flights.map((flight) => {
      // PRICE SCORE (Lower price is better)
      let priceScore = 100;
      if (maxPrice !== minPrice) {
        priceScore = Math.round(100 * ((maxPrice - flight.price) / (maxPrice - minPrice)));
      }

      // DURATION SCORE (Shorter travel time is better)
      let durationScore = 100;
      if (maxDuration !== minDuration) {
        durationScore = Math.round(100 * ((maxDuration - flight.duration) / (maxDuration - minDuration)));
      }

      // STOPS SCORE (Fewer stops is better - Absolute mapping)
      let stopsScore = 0;
      if (flight.stops === 0) stopsScore = 100;
      else if (flight.stops === 1) stopsScore = 60;
      else if (flight.stops === 2) stopsScore = 20;
      else stopsScore = 0; // 3+ stops

      // RATING SCORE (Higher is better - Absolute out of 5 stars)
      const ratingScore = Math.round((flight.rating / 5) * 100);

      const scores: FactorScores = {
        price: priceScore,
        duration: durationScore,
        stops: stopsScore,
        rating: ratingScore,
      };

      // Calculate Weighted Sum
      const totalWeight = weights.price + weights.duration + weights.stops + weights.rating;

      let totalScore = 0;
      if (totalWeight > 0) {
        const weightedSum =
          scores.price * weights.price +
          scores.duration * weights.duration +
          scores.stops * weights.stops +
          scores.rating * weights.rating;
        totalScore = Math.round(weightedSum / totalWeight);
      } else {
        // If all weights are set to 0, distribute equally
        totalScore = Math.round((scores.price + scores.duration + scores.stops + scores.rating) / 4);
      }

      return {
        ...flight,
        scores,
        totalScore,
      };
    });

    // 3. Sort flights by totalScore descending
    return calculated.sort((a, b) => b.totalScore - a.totalScore);
  }, [flights, weights]);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleWeightChange = (factor: keyof FactorWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [factor]: val,
    }));
    setActivePreset('custom');
  };

  const applyPreset = (presetName: string) => {
    if (PRESETS[presetName]) {
      setWeights(PRESETS[presetName]);
      setActivePreset(presetName);
    }
  };

  // Reset flights back to standard mock options
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset flight data back to defaults?')) {
      setFlights(INITIAL_FLIGHTS);
      setWeights(PRESETS.balanced);
      setActivePreset('balanced');
      setEditingId(null);
      setIsFormOpen(false);
    }
  };

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formState.airline.trim()) {
      alert('Airline name is required.');
      return;
    }

    const durationInMinutes =
      Number(formState.durationHours) * 60 + Number(formState.durationMinutes);

    if (durationInMinutes <= 0) {
      alert('Please enter a valid flight duration.');
      return;
    }

    const parsedFlight: Flight = {
      id: editingId || 'f_' + Date.now(),
      airline: formState.airline,
      flightNumber: formState.flightNumber.trim().toUpperCase() || 'FL ' + Math.floor(Math.random() * 900 + 100),
      price: Math.max(0, Number(formState.price)),
      duration: durationInMinutes,
      stops: Number(formState.stops),
      rating: parseFloat(Math.min(5, Math.max(1, Number(formState.rating))).toFixed(1)),
      baggageIncluded: formState.baggageIncluded,
      departureTime: formState.departureTime,
      arrivalTime: formState.arrivalTime,
    };

    if (editingId) {
      // Edit mode
      setFlights((prev) => prev.map((f) => (f.id === editingId ? parsedFlight : f)));
      setEditingId(null);
    } else {
      // Add mode
      setFlights((prev) => [...prev, parsedFlight]);
    }

    // Reset Form
    setFormState(DEFAULT_FORM_STATE);
    setIsFormOpen(false);
  };

  // Populate form to edit a flight
  const handleEditClick = (flight: Flight) => {
    const hours = Math.floor(flight.duration / 60);
    const minutes = flight.duration % 60;

    setFormState({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      price: flight.price,
      durationHours: hours,
      durationMinutes: minutes,
      stops: flight.stops,
      rating: flight.rating,
      baggageIncluded: flight.baggageIncluded,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    });

    setEditingId(flight.id);
    setIsFormOpen(true);

    // Scroll sidebar form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a flight
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this flight option?')) {
      setFlights((prev) => prev.filter((f) => f.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormState(DEFAULT_FORM_STATE);
        setIsFormOpen(false);
      }
    }
  };

  const handleCancelForm = () => {
    setFormState(DEFAULT_FORM_STATE);
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="app-container">
      {/* -------------------------------------------------------------------------
          HEADER
          ------------------------------------------------------------------------- */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-icon">FR</div>
          <div className="brand-text">
            <h1>FlyRank</h1>
            <p>Interactive Multi-Criteria Flight Selection Dashboard</p>
          </div>
        </div>
        <div className="header-controls">
          <button
            className="theme-toggle-btn"
            onClick={() => setIsDarkMode((prev) => !prev)}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️ Light UI' : '🌙 Dark UI'}
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------------------
          PRESETS PANEL
          ------------------------------------------------------------------------- */}
      <section className="presets-container" aria-label="Quick Presets">
        <span className="presets-label">Quick Personas:</span>
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            className={`preset-btn ${activePreset === key ? 'active' : ''}`}
            onClick={() => applyPreset(key)}
          >
            {preset.label}
          </button>
        ))}
        {activePreset === 'custom' && (
          <span className="preset-btn active" style={{ background: 'var(--accent-cyan)' }}>
            Custom Configuration ⚙️
          </span>
        )}
      </section>

      {/* -------------------------------------------------------------------------
          DASHBOARD MAIN GRID
          ------------------------------------------------------------------------- */}
      <div className="dashboard-grid">
        {/* SIDEBAR: Weights Config & Add Flight Form */}
        <aside className="sidebar">
          {/* Section 1: Multi-Criteria Factor Weights */}
          <div className="sidebar-widget">
            <h2 className="widget-title">
              <span>Factor Importance</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>0 (Low) to 5 (High)</span>
            </h2>
            <div className="sliders-wrapper">
              {/* PRICE WEIGHT */}
              <div className="slider-group">
                <div className="slider-info">
                  <span className="slider-label">💰 Price (Lower is Better)</span>
                  <span className="slider-value">{weights.price}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="custom-range"
                  value={weights.price}
                  onChange={(e) => handleWeightChange('price', Number(e.target.value))}
                  aria-label="Price Factor Weight"
                />
              </div>

              {/* DURATION WEIGHT */}
              <div className="slider-group">
                <div className="slider-info">
                  <span className="slider-label">⏱️ Duration (Shorter is Better)</span>
                  <span className="slider-value">{weights.duration}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="custom-range"
                  value={weights.duration}
                  onChange={(e) => handleWeightChange('duration', Number(e.target.value))}
                  aria-label="Duration Factor Weight"
                />
              </div>

              {/* STOPS WEIGHT */}
              <div className="slider-group">
                <div className="slider-info">
                  <span className="slider-label">🛑 Stops (Fewer is Better)</span>
                  <span className="slider-value">{weights.stops}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="custom-range"
                  value={weights.stops}
                  onChange={(e) => handleWeightChange('stops', Number(e.target.value))}
                  aria-label="Stops Factor Weight"
                />
              </div>

              {/* COMFORT/RATING WEIGHT */}
              <div className="slider-group">
                <div className="slider-info">
                  <span className="slider-label">⭐ Airline Comfort / Rating</span>
                  <span className="slider-value">{weights.rating}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  className="custom-range"
                  value={weights.rating}
                  onChange={(e) => handleWeightChange('rating', Number(e.target.value))}
                  aria-label="Comfort Rating Factor Weight"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Add/Edit Flight Widget */}
          <div className="sidebar-widget">
            <h2 className="widget-title">
              <span>{editingId ? '✏️ Edit Flight' : '➕ Add Flight Option'}</span>
              {!isFormOpen && (
                <button
                  className="preset-btn"
                  onClick={() => setIsFormOpen(true)}
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                >
                  Configure
                </button>
              )}
            </h2>

            {isFormOpen ? (
              <form onSubmit={handleFormSubmit} className="flight-form">
                {/* Airline Name */}
                <div className="form-group">
                  <label htmlFor="airline-input">Airline</label>
                  <select
                    id="airline-input"
                    className="input-field"
                    value={formState.airline}
                    onChange={(e) => setFormState({ ...formState, airline: e.target.value })}
                  >
                    <option value="Delta Air Lines">Delta Air Lines</option>
                    <option value="United Airlines">United Airlines</option>
                    <option value="Spirit Airlines">Spirit Airlines</option>
                    <option value="JetBlue Airways">JetBlue Airways</option>
                    <option value="American Airlines">American Airlines</option>
                    <option value="Southwest Airlines">Southwest Airlines</option>
                    <option value="Alaska Airlines">Alaska Airlines</option>
                    <option value="Frontier Airlines">Frontier Airlines</option>
                  </select>
                </div>

                <div className="form-row">
                  {/* Flight Number */}
                  <div className="form-group">
                    <label htmlFor="flight-num">Flight No.</label>
                    <input
                      id="flight-num"
                      type="text"
                      className="input-field"
                      placeholder="e.g. UA 314"
                      value={formState.flightNumber}
                      onChange={(e) => setFormState({ ...formState, flightNumber: e.target.value })}
                    />
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label htmlFor="price-input">Price ($)</label>
                    <input
                      id="price-input"
                      type="number"
                      min="1"
                      className="input-field"
                      value={formState.price}
                      onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  {/* Duration Hours */}
                  <div className="form-group">
                    <label htmlFor="duration-hrs">Hours</label>
                    <input
                      id="duration-hrs"
                      type="number"
                      min="0"
                      max="24"
                      className="input-field"
                      value={formState.durationHours}
                      onChange={(e) => setFormState({ ...formState, durationHours: Number(e.target.value) })}
                    />
                  </div>

                  {/* Duration Mins */}
                  <div className="form-group">
                    <label htmlFor="duration-mins">Mins</label>
                    <input
                      id="duration-mins"
                      type="number"
                      min="0"
                      max="59"
                      className="input-field"
                      value={formState.durationMinutes}
                      onChange={(e) => setFormState({ ...formState, durationMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  {/* Stops */}
                  <div className="form-group">
                    <label htmlFor="stops-input">Stops</label>
                    <select
                      id="stops-input"
                      className="input-field"
                      value={formState.stops}
                      onChange={(e) => setFormState({ ...formState, stops: Number(e.target.value) })}
                    >
                      <option value={0}>Non-stop (Direct)</option>
                      <option value={1}>1 Stop</option>
                      <option value={2}>2+ Stops</option>
                    </select>
                  </div>

                  {/* Rating */}
                  <div className="form-group">
                    <label htmlFor="rating-input">Rating (1.0 - 5.0)</label>
                    <input
                      id="rating-input"
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      className="input-field"
                      value={formState.rating}
                      onChange={(e) => setFormState({ ...formState, rating: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  {/* Departure Time */}
                  <div className="form-group">
                    <label htmlFor="dep-time">Departure</label>
                    <input
                      id="dep-time"
                      type="text"
                      className="input-field"
                      placeholder="e.g. 08:30 AM"
                      value={formState.departureTime}
                      onChange={(e) => setFormState({ ...formState, departureTime: e.target.value })}
                    />
                  </div>

                  {/* Arrival Time */}
                  <div className="form-group">
                    <label htmlFor="arr-time">Arrival</label>
                    <input
                      id="arr-time"
                      type="text"
                      className="input-field"
                      placeholder="e.g. 11:45 AM"
                      value={formState.arrivalTime}
                      onChange={(e) => setFormState({ ...formState, arrivalTime: e.target.value })}
                    />
                  </div>
                </div>

                {/* Checked baggage included */}
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={formState.baggageIncluded}
                    onChange={(e) => setFormState({ ...formState, baggageIncluded: e.target.checked })}
                  />
                  💼 Checked Baggage Included
                </label>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Save Edits' : 'Add Flight'}
                  </button>
                  <button type="button" className="btn btn-cancel" onClick={handleCancelForm}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                You can add alternative flight options and adjust criteria on the fly to test how they stack up. Click "Configure" to open the flight creator.
              </p>
            )}
          </div>
        </aside>

        {/* MAIN RESULTS PANEL: Ranked Flights List */}
        <main className="main-content">
          <div className="results-header">
            <h2 className="results-count">
              Ranked Flight Options (<span>{scoredFlights.length}</span>)
            </h2>
            <button className="reset-data-btn" onClick={handleResetData}>
              Reset to default mock flights
            </button>
          </div>

          {scoredFlights.length > 0 ? (
            <div className="flights-stack">
              {scoredFlights.map((flight, index) => {
                const airlineMeta = getAirlineMeta(flight.airline);
                return (
                  <article
                    key={flight.id}
                    className={`flight-card rank-${index}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Column 1: Airline brand metadata */}
                    <div className="airline-col">
                      <div
                        className="airline-avatar"
                        style={{ background: airlineMeta.bg }}
                        aria-hidden="true"
                      >
                        {airlineMeta.initials}
                      </div>
                      <div className="airline-details">
                        <h3>{flight.airline}</h3>
                        <span className="flight-number-tag">{flight.flightNumber}</span>
                      </div>
                    </div>

                    {/* Column 2: Route, duration & timeline details */}
                    <div className="route-col">
                      <div className="route-timeline">
                        <span className="time">{flight.departureTime}</span>
                        <div className="duration-line" aria-label={`Flight duration ${formatDuration(flight.duration)}`}>
                          <span className="duration-label">{formatDuration(flight.duration)}</span>
                          <div className="line-art">
                            <span className="line-art-plane">✈️</span>
                          </div>
                        </div>
                        <span className="time">{flight.arrivalTime}</span>
                      </div>
                      
                      {/* Secondary Badges Details */}
                      <div className="badges-row">
                        <span className={`tag tag-stops ${flight.stops === 0 ? 'direct' : ''}`}>
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                        </span>
                        {flight.baggageIncluded && (
                          <span className="tag tag-baggage" title="Baggage Included">
                            💼 Baggage Inc.
                          </span>
                        )}
                        <span className="tag tag-rating" aria-label={`Rating ${flight.rating} out of 5 stars`}>
                          <span className="star-gold">★</span> {flight.rating}
                        </span>
                        <span className="tag" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: '600' }}>
                          ${flight.price}
                        </span>
                      </div>
                    </div>

                    {/* Column 3: Scores, Weighted average & Breakdown */}
                    <div className="score-col">
                      {/* Breakdown mini progress bars */}
                      <div className="breakdown-wrapper" aria-label="Score Breakdown across factors">
                        {/* Price Breakdown */}
                        <div className="breakdown-bar-group">
                          <div className="bar-label-row">
                            <span>Price ({weights.price}x)</span>
                            <span>{flight.scores.price}%</span>
                          </div>
                          <div className="bar-bg">
                            <div
                              className="bar-fill price"
                              style={{ width: `${flight.scores.price}%` }}
                            />
                          </div>
                        </div>

                        {/* Duration Breakdown */}
                        <div className="breakdown-bar-group">
                          <div className="bar-label-row">
                            <span>Duration ({weights.duration}x)</span>
                            <span>{flight.scores.duration}%</span>
                          </div>
                          <div className="bar-bg">
                            <div
                              className="bar-fill duration"
                              style={{ width: `${flight.scores.duration}%` }}
                            />
                          </div>
                        </div>

                        {/* Stops Breakdown */}
                        <div className="breakdown-bar-group">
                          <div className="bar-label-row">
                            <span>Stops ({weights.stops}x)</span>
                            <span>{flight.scores.stops}%</span>
                          </div>
                          <div className="bar-bg">
                            <div
                              className="bar-fill stops"
                              style={{ width: `${flight.scores.stops}%` }}
                            />
                          </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="breakdown-bar-group">
                          <div className="bar-label-row">
                            <span>Rating ({weights.rating}x)</span>
                            <span>{flight.scores.rating}%</span>
                          </div>
                          <div className="bar-bg">
                            <div
                              className="bar-fill rating"
                              style={{ width: `${flight.scores.rating}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Main aggregate Score Gauge */}
                      <div className="score-display">
                        <span className="rank-badge">#{index + 1}</span>
                        <span className="score-num">{flight.totalScore}</span>
                        <span className="score-lbl">Score</span>
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="card-actions">
                        <button
                          className="action-icon-btn"
                          onClick={() => handleEditClick(flight)}
                          title="Edit flight details"
                          aria-label={`Edit ${flight.airline} flight ${flight.flightNumber}`}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteClick(flight.id)}
                          title="Delete flight option"
                          aria-label={`Delete ${flight.airline} flight ${flight.flightNumber}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">✈️</span>
              <h3>No Flights in Your Bucket</h3>
              <p>Add some custom flights using the sidebar form or reset to our default options to begin ranking.</p>
              <button className="btn btn-primary" onClick={() => setFlights(INITIAL_FLIGHTS)} style={{ maxWidth: '240px', margin: '0 auto' }}>
                Load Pre-defined Flights
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
