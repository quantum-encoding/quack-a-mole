import React, { useEffect, useState } from 'react';

interface MoleRadarProps {
  onMoleDetected: () => void;
  sensitivity: number;
}

export const MoleRadar: React.FC<MoleRadarProps> = ({ onMoleDetected, sensitivity }) => {
  const [radarAngle, setRadarAngle] = useState(0);
  const [detectedMoles, setDetectedMoles] = useState<Array<{x: number, y: number, id: string}>>([]);
  const [radarStatus, setRadarStatus] = useState<'scanning' | 'alert' | 'clear'>('scanning');

  useEffect(() => {
    // Rotate radar sweep
    const radarInterval = setInterval(() => {
      setRadarAngle(prev => (prev + 5) % 360);
      
      // Randomly detect moles based on sensitivity
      if (Math.random() > (1 - sensitivity * 0.1)) {
        const newMole = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: `mole_${Date.now()}`
        };
        
        setDetectedMoles(prev => [...prev, newMole]);
        setRadarStatus('alert');
        onMoleDetected();
        
        // Clear mole after 3 seconds
        setTimeout(() => {
          setDetectedMoles(prev => prev.filter(m => m.id !== newMole.id));
          setRadarStatus('scanning');
        }, 3000);
      }
    }, 100);

    return () => clearInterval(radarInterval);
  }, [sensitivity, onMoleDetected]);

  const getRadarColor = () => {
    switch(radarStatus) {
      case 'alert': return '#FF0000';
      case 'clear': return '#00FF00';
      default: return '#00FF00';
    }
  };

  return (
    <div className="mole-radar">
      <h3>🎯 Quantum Mole Radar</h3>
      <div className="radar-display" style={{
        width: '200px',
        height: '200px',
        border: `2px solid ${getRadarColor()}`,
        borderRadius: '50%',
        position: 'relative',
        background: 'radial-gradient(circle, rgba(0,255,0,0.1) 0%, rgba(0,0,0,0.8) 100%)'
      }}>
        {/* Radar sweep line */}
        <div style={{
          position: 'absolute',
          width: '100px',
          height: '2px',
          background: `linear-gradient(to right, transparent, ${getRadarColor()})`,
          top: '50%',
          left: '50%',
          transformOrigin: '0 50%',
          transform: `rotate(${radarAngle}deg)`
        }} />
        
        {/* Radar rings */}
        {[25, 50, 75].map(size => (
          <div key={size} style={{
            position: 'absolute',
            width: `${size * 2}%`,
            height: `${size * 2}%`,
            border: '1px solid rgba(0,255,0,0.3)',
            borderRadius: '50%',
            top: `${50 - size}%`,
            left: `${50 - size}%`
          }} />
        ))}
        
        {/* Detected moles */}
        {detectedMoles.map(mole => (
          <div key={mole.id} style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: 'red',
            borderRadius: '50%',
            left: `${mole.x}%`,
            top: `${mole.y}%`,
            animation: 'mole-blink 0.5s infinite'
          }}>
            🔴
          </div>
        ))}
      </div>
      
      <div className="radar-info">
        <p>Status: {radarStatus.toUpperCase()}</p>
        <p>Sensitivity: {(sensitivity * 100).toFixed(0)}%</p>
        <p>Moles Tracked: {detectedMoles.length}</p>
        {radarStatus === 'alert' && <p style={{color: 'red'}}>⚠️ MOLE DETECTED!</p>}
      </div>
    </div>
  );
};