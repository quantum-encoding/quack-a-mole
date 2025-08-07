import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:5000';

interface QuackOptions {
  intensity: string;
  dimension: string;
  entangleDucks: boolean;
}

interface WhackRequest {
  x: number;
  y: number;
  force: string;
  tool: string;
}

interface WhackResponse {
  success: boolean;
  stylePoints: number;
  message: string;
  whackLatency: number;
  moleEscaped: boolean;
}

export class DuckAPI {
  static async quantumQuack(options: QuackOptions) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quack`, null, {
        params: { intensity: options.intensity }
      });
      
      // Also call ML service for mood analysis
      const mlResponse = await axios.post(`${ML_API_URL}/api/analyze_quack`, {
        audio_data: [] // Simulated audio
      });
      
      return {
        mood: mlResponse.data.mood,
        quantumState: 'superposition',
        entangledDucks: Math.floor(Math.random() * 10),
        quackResponse: response.data // Use the response data
      };
    } catch (error) {
      console.error('Quack API error:', error);
      throw error;
    }
  }

  static async whackMole(request: WhackRequest): Promise<WhackResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/mole/whack`, request);
      return response.data;
    } catch (error) {
      console.error('Whack API error:', error);
      // Return mock data if API fails
      return {
        success: Math.random() > 0.5,
        stylePoints: Math.floor(Math.random() * 100),
        message: 'API Error - Using quantum backup',
        whackLatency: 1.5,
        moleEscaped: false
      };
    }
  }

  static async releaseTheQuacken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/emergency/release-the-quacken`);
      console.log('QUACKEN RELEASED:', response.data);
      
      // Also trigger quantum entanglement
      await axios.post(`${ML_API_URL}/api/entangle`, {
        duck1_id: 'quacken',
        duck2_id: 'all_ducks'
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to release the Quacken:', error);
      throw error;
    }
  }

  static async getPondStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/pond/status`);
      return response.data;
    } catch (error) {
      console.error('Pond status error:', error);
      return {
        waterLevel: 50,
        temperature: 20,
        duckCount: 0,
        activeMoles: 0,
        warnings: ['API Offline - Using quantum backup']
      };
    }
  }

  static async identifyDuck(imageData: any) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/identify`, {
        image: imageData
      });
      return response.data;
    } catch (error) {
      console.error('Duck identification error:', error);
      throw error;
    }
  }

  static async classifyQuantumDuck(quantumState: string) {
    try {
      const response = await axios.post(`${ML_API_URL}/api/quantum_classify`, {
        quantum_state: quantumState
      });
      return response.data;
    } catch (error) {
      console.error('Quantum classification error:', error);
      throw error;
    }
  }
}