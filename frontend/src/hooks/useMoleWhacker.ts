import { useState, useCallback } from 'react';
import { DuckAPI } from '../services/duckAPI';

interface WhackOptions {
  force: string;
  tool: string;
}

export const useMoleWhacker = () => {
  const [whackingInProgress, setWhackingInProgress] = useState(false);
  const [totalWhacks, setTotalWhacks] = useState(0);
  const [successfulWhacks, setSuccessfulWhacks] = useState(0);
  const [stylePoints, setStylePoints] = useState(0);

  const whackMole = useCallback(async (options: WhackOptions): Promise<boolean> => {
    setWhackingInProgress(true);
    
    try {
      const result = await DuckAPI.whackMole({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        ...options
      });
      
      setTotalWhacks(prev => prev + 1);
      
      if (result.success) {
        setSuccessfulWhacks(prev => prev + 1);
        setStylePoints(prev => prev + result.stylePoints);
        
        // Special effects for high style points
        if (result.stylePoints > 50) {
          console.log('🎆 SPECTACULAR WHACK! 🎆');
        }
      }
      
      if (result.moleEscaped) {
        console.log('🕳️ Mole escaped through quantum tunnel!');
      }
      
      return result.success;
    } catch (error) {
      console.error('Whack failed:', error);
      return false;
    } finally {
      setWhackingInProgress(false);
    }
  }, []);

  const getAccuracy = useCallback(() => {
    if (totalWhacks === 0) return 0;
    return (successfulWhacks / totalWhacks) * 100;
  }, [totalWhacks, successfulWhacks]);

  const resetStats = useCallback(() => {
    setTotalWhacks(0);
    setSuccessfulWhacks(0);
    setStylePoints(0);
  }, []);

  return {
    whackMole,
    whackingInProgress,
    totalWhacks,
    successfulWhacks,
    stylePoints,
    accuracy: getAccuracy(),
    resetStats
  };
};