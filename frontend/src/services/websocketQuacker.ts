/**
 * WebSocket service for real-time duck communications
 * Enables live quack streaming and mole alerts
 */

export interface QuackMessage {
  type: 'quack' | 'mole_alert' | 'entanglement' | 'pond_update' | 'emergency';
  data: any;
  timestamp: number;
}

export class WebSocketQuacker {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(message: QuackMessage) => void>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string = 'ws://localhost:8080/ws') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('🦆 WebSocket connected to Duck Network');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: QuackMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: QuackMessage) {
    // Handle special message types
    switch (message.type) {
      case 'emergency':
        console.log('🚨 EMERGENCY MESSAGE:', message.data);
        this.playEmergencySound();
        break;
      case 'mole_alert':
        console.log('🕳️ MOLE DETECTED AT:', message.data);
        break;
      case 'entanglement':
        console.log('🔗 QUANTUM ENTANGLEMENT EVENT:', message.data);
        break;
    }

    // Notify all listeners for this message type
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach(listener => listener(message));
    }

    // Notify universal listeners
    const universalListeners = this.listeners.get('*');
    if (universalListeners) {
      universalListeners.forEach(listener => listener(message));
    }
  }

  subscribe(type: string, callback: (message: QuackMessage) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  sendQuack(intensity: number, dimension: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'quack',
        data: {
          intensity,
          dimension,
          timestamp: Date.now()
        }
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  reportMole(x: number, y: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'mole_sighting',
        data: { x, y, timestamp: Date.now() }
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  releaseTheQuacken() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'release_quacken',
        data: {
          authorization: 'emergency_protocol',
          timestamp: Date.now()
        }
      };
      this.ws.send(JSON.stringify(message));
      console.log('🐙 QUACKEN RELEASE SIGNAL SENT!');
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Duck network offline.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms... (Attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private playEmergencySound() {
    // Create an oscillator for emergency quack sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    oscillator.type = 'sawtooth'; // Urgent sound

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  get isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const wsQuacker = new WebSocketQuacker();