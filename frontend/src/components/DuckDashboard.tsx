import React, { useState, useEffect } from 'react';
import { useQuantumQuack } from '../hooks/useQuantumQuack';
import { useMoleWhacker } from '../hooks/useMoleWhacker';
import { DuckAPI } from '../services/duckAPI';
import { QuackButton } from './QuackButton';
import { MoleRadar } from './MoleRadar';

interface DuckStats {
  totalQuacks: number;
  quantumEntanglement: number;
  molesDetected: number;
  molesWhacked: number;
  pondTemperature: number;
  duckMood: 'happy' | 'angry' | 'quantum';
}

export const DuckDashboard: React.FC = () => {
  const [stats, setStats] = useState<DuckStats>({
    totalQuacks: 0,
    quantumEntanglement: 0.73,
    molesDetected: 0,
    molesWhacked: 0,
    pondTemperature: 20,
    duckMood: 'happy'
  });

  const { quack, isQuacking, quackHistory } = useQuantumQuack();
  const { whackMole, whackingInProgress } = useMoleWhacker();

  const [duckMatrix, setDuckMatrix] = useState<string[][]>([]);
  const [alertLevel, setAlertLevel] = useState<'green' | 'yellow' | 'red'>('green');

  // Initialize the pond with ducks
  useEffect(() => {
    initializePondMatrix();
    startQuantumOscillation();

    // HACK: Polling for moles every second
    const moleInterval = setInterval(checkForMoles, 1000);

    return () => clearInterval(moleInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initializePondMatrix = () => {
    // Create a 10x10 grid of pond positions
    const matrix = Array(10).fill(null).map(() =>
      Array(10).fill(null).map(() =>
        Math.random() > 0.7 ? '🦆' : '💧'
      )
    );
    setDuckMatrix(matrix);
  };

  const startQuantumOscillation = () => {
    // TODO: Implement actual quantum oscillation
    // For now, just randomly move ducks around
    setInterval(() => {
      setStats(prev => ({
        ...prev,
        quantumEntanglement: Math.sin(Date.now() / 1000) * 0.5 + 0.5
      }));
    }, 100);
  };

  const checkForMoles = async () => {
    // FIXME: Sometimes detects the user's mouse as a mole
    const moleDetected = Math.random() > 0.9;
    
    if (moleDetected) {
      setStats(prev => ({
        ...prev,
        molesDetected: prev.molesDetected + 1
      }));
      
      setAlertLevel('red');
      
      // Auto-whack the mole
      handleMoleWhack();
      
      // Reset alert after 2 seconds
      setTimeout(() => setAlertLevel('green'), 2000);
    }
  };

  const handleQuantumQuack = async () => {
    try {
      const result = await quack({
        intensity: 'maximum',
        dimension: 'current',
        entangleDucks: true
      });
      
      setStats(prev => ({
        ...prev,
        totalQuacks: prev.totalQuacks + 1,
        duckMood: result.mood as 'happy' | 'angry' | 'quantum'
      }));
      
      // Update pond matrix with quack ripples
      createQuackRipple();
    } catch (error) {
      console.error('Quack failed:', error);
      // DEPRECATED: Use quantum error handling
    }
  };

  const handleMoleWhack = async () => {
    const success = await whackMole({ force: 'gentle', tool: 'foam_hammer' });
    
    if (success) {
      setStats(prev => ({
        ...prev,
        molesWhacked: prev.molesWhacked + 1
      }));
    }
  };

  const createQuackRipple = () => {
    // BUG: Ripples sometimes escape the pond
    console.log('Creating quantum ripple effect...');
    // Animation would go here
  };

  const handleEmergencyProtocol = () => {
    // Release the Quacken!
    console.log('🐙 EMERGENCY PROTOCOL ACTIVATED');
    DuckAPI.releaseTheQuacken();
    
    // Fill entire pond with ducks
    setDuckMatrix(Array(10).fill(null).map(() =>
      Array(10).fill('🦆')
    ));
  };

  return (
    <div className="duck-dashboard">
      <h1>🦆 Quantum Duck Command Center</h1>
      
      <div className="alert-status" style={{ 
        backgroundColor: alertLevel === 'red' ? '#ff4444' : 
                        alertLevel === 'yellow' ? '#ffaa00' : '#44ff44' 
      }}>
        Alert Level: {alertLevel.toUpperCase()}
        {alertLevel === 'red' && ' - MOLE DETECTED!'}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Quacks</h3>
          <div className="stat-value">{stats.totalQuacks}</div>
        </div>
        
        <div className="stat-card">
          <h3>Quantum Entanglement</h3>
          <div className="stat-value">
            {(stats.quantumEntanglement * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Mole Threat Level</h3>
          <div className="stat-value">
            {stats.molesDetected} detected / {stats.molesWhacked} whacked
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Duck Mood</h3>
          <div className="stat-value">
            {stats.duckMood === 'happy' ? '😊' :
             stats.duckMood === 'angry' ? '😠' : '🌀'}
          </div>
        </div>
      </div>

      <div className="pond-visualization">
        <h3>Pond Status (Live)</h3>
        <div className="pond-grid">
          {duckMatrix.map((row, i) => (
            <div key={i} className="pond-row">
              {row.map((cell, j) => (
                <span key={j} className="pond-cell">{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="control-panel">
        <QuackButton 
          onClick={handleQuantumQuack}
          disabled={isQuacking}
          variant="quantum"
        />
        
        <button 
          onClick={handleMoleWhack}
          disabled={whackingInProgress}
          className="whack-button"
        >
          🔨 Whack Mole
        </button>
        
        <button 
          onClick={handleEmergencyProtocol}
          className="emergency-button"
        >
          🚨 RELEASE THE QUACKEN
        </button>
      </div>

      <MoleRadar 
        onMoleDetected={handleMoleWhack}
        sensitivity={0.8}
      />

      <div className="quack-history">
        <h3>Recent Quack Events</h3>
        <ul>
          {quackHistory.slice(-5).map((quack, i) => (
            <li key={i}>
              {new Date(quack.timestamp).toLocaleTimeString()} - 
              Intensity: {quack.intensity} - 
              Dimension: {quack.dimension}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};