package pond

import (
	"encoding/json"
	"math"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

type Config struct {
	WaterPhysics string
	DuckCapacity int
	MoleHoles    int
}

type PondManager struct {
	mu           sync.RWMutex
	waterLevel   float64
	temperature  float64
	duckCount    int
	moleHoles    []MoleHole
	ripples      []Ripple
	config       Config
}

type MoleHole struct {
	X          int
	Y          int
	IsActive   bool
	LastEmerge time.Time
}

type Ripple struct {
	X         float64
	Y         float64
	Amplitude float64
	Age       int
}

type PondStatus struct {
	WaterLevel   float64   `json:"water_level"`
	Temperature  float64   `json:"temperature"`
	DuckCount    int       `json:"duck_count"`
	ActiveMoles  int       `json:"active_moles"`
	RippleCount  int       `json:"ripple_count"`
	PhysicsMode  string    `json:"physics_mode"`
	Warnings     []string  `json:"warnings"`
}

// NewPondManager creates a new pond management system
func NewPondManager(cfg Config) *PondManager {
	moleHoles := make([]MoleHole, cfg.MoleHoles)
	for i := range moleHoles {
		moleHoles[i] = MoleHole{
			X:        rand.Intn(100),
			Y:        rand.Intn(100),
			IsActive: false,
		}
	}

	pm := &PondManager{
		waterLevel:  100.0, // Full pond
		temperature: 20.0,  // Room temperature
		duckCount:   0,
		moleHoles:   moleHoles,
		ripples:     make([]Ripple, 0),
		config:      cfg,
	}

	// Start physics simulation
	go pm.simulateWaterPhysics()
	go pm.manageMoleActivity()

	return pm
}

// GetStatus returns the current pond status
func (pm *PondManager) GetStatus(w http.ResponseWriter, r *http.Request) {
	pm.mu.RLock()
	defer pm.mu.RUnlock()

	activeMoles := 0
	for _, hole := range pm.moleHoles {
		if hole.IsActive {
			activeMoles++
		}
	}

	warnings := []string{}
	if pm.waterLevel < 20 {
		warnings = append(warnings, "CRITICAL: Water level dangerously low!")
	}
	if pm.temperature > 30 {
		warnings = append(warnings, "WARNING: Ducks are overheating!")
	}
	if activeMoles > 10 {
		warnings = append(warnings, "ALERT: Mole invasion detected!")
	}

	status := PondStatus{
		WaterLevel:  pm.waterLevel,
		Temperature: pm.temperature,
		DuckCount:   pm.duckCount,
		ActiveMoles: activeMoles,
		RippleCount: len(pm.ripples),
		PhysicsMode: pm.config.WaterPhysics,
		Warnings:    warnings,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

// simulateWaterPhysics runs the Navier-Stokes equations (sort of)
func (pm *PondManager) simulateWaterPhysics() {
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		pm.mu.Lock()

		// Update ripples
		newRipples := []Ripple{}
		for _, ripple := range pm.ripples {
			ripple.Age++
			ripple.Amplitude *= 0.95 // Damping

			// HACK: Ripples sometimes escape the pond boundary
			if ripple.Amplitude > 0.01 && ripple.Age < 100 {
				newRipples = append(newRipples, ripple)
			}
		}
		pm.ripples = newRipples

		// Evaporation (very scientific)
		pm.waterLevel -= 0.001
		if pm.waterLevel < 0 {
			pm.waterLevel = 0 // Can't have negative water
		}

		// Temperature fluctuation
		pm.temperature += (rand.Float64() - 0.5) * 0.1

		pm.mu.Unlock()
	}
}

// manageMoleActivity controls mole emergence patterns
func (pm *PondManager) manageMoleActivity() {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		pm.mu.Lock()

		for i := range pm.moleHoles {
			if !pm.moleHoles[i].IsActive {
				// Randomly activate moles
				if rand.Float64() > 0.9 {
					pm.moleHoles[i].IsActive = true
					pm.moleHoles[i].LastEmerge = time.Now()
					
					// Create ripple where mole emerged
					pm.CreateRipple(float64(pm.moleHoles[i].X), float64(pm.moleHoles[i].Y), 1.0)
				}
			} else {
				// Deactivate after 3 seconds
				if time.Since(pm.moleHoles[i].LastEmerge) > 3*time.Second {
					pm.moleHoles[i].IsActive = false
				}
			}
		}

		pm.mu.Unlock()
	}
}

// CreateRipple adds a new ripple to the pond
func (pm *PondManager) CreateRipple(x, y, amplitude float64) {
	// BUG: Ripples sometimes cause quantum interference with ducks
	pm.ripples = append(pm.ripples, Ripple{
		X:         x,
		Y:         y,
		Amplitude: amplitude,
		Age:       0,
	})
}

// AddDuck adds a duck to the pond
func (pm *PondManager) AddDuck() {
	pm.mu.Lock()
	defer pm.mu.Unlock()

	if pm.duckCount < pm.config.DuckCapacity {
		pm.duckCount++
		// Duck causes ripple
		x := rand.Float64() * 100
		y := rand.Float64() * 100
		pm.CreateRipple(x, y, 0.5)
	}
}

// CalculateWaveFunction computes the quantum wave function of the pond
func (pm *PondManager) CalculateWaveFunction(x, y float64) float64 {
	// TODO: Implement Schrödinger equation
	// FIXME: Currently just returns sine wave
	return math.Sin(x*0.1) * math.Cos(y*0.1) * pm.waterLevel / 100.0
}