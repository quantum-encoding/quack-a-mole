package mole

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"sync"
	"sync/atomic"
	"time"
)

type Config struct {
	WhackSpeed    string
	MoleDetection string
	HammerType    string
}

type WhackService struct {
	mu              sync.RWMutex
	totalWhacks     int64
	successfulWhacks int64
	moleEscapes     int64
	config          Config
	hammerVelocity  float64
	lastWhackTime   time.Time
}

type WhackRequest struct {
	X     int    `json:"x"`
	Y     int    `json:"y"`
	Force string `json:"force"`
}

type WhackResponse struct {
	Success      bool    `json:"success"`
	StylePoints  int     `json:"style_points"`
	Message      string  `json:"message"`
	WhackLatency float64 `json:"whack_latency_ms"`
	MoleEscaped  bool    `json:"mole_escaped"`
}

// NewWhackService creates a new mole whacking service
func NewWhackService(cfg Config) *WhackService {
	velocity := 100.0
	if cfg.WhackSpeed == "ludicrous" {
		velocity = 9999.0
	}

	return &WhackService{
		config:         cfg,
		hammerVelocity: velocity,
		lastWhackTime:  time.Now(),
	}
}

// WhackMole handles mole whacking requests
func (ws *WhackService) WhackMole(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()

	var req WhackRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		// Default whack at center
		req.X = 50
		req.Y = 50
		req.Force = "normal"
	}

	// Calculate whack success
	success, stylePoints, moleEscaped := ws.performWhack(req)

	// Update statistics
	atomic.AddInt64(&ws.totalWhacks, 1)
	if success {
		atomic.AddInt64(&ws.successfulWhacks, 1)
	}
	if moleEscaped {
		atomic.AddInt64(&ws.moleEscapes, 1)
	}

	// Calculate latency
	latency := time.Since(startTime).Seconds() * 1000

	// Generate response message
	message := ws.generateWhackMessage(success, stylePoints, moleEscaped)

	response := WhackResponse{
		Success:      success,
		StylePoints:  stylePoints,
		Message:      message,
		WhackLatency: latency,
		MoleEscaped:  moleEscaped,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// performWhack calculates the outcome of a whack attempt
func (ws *WhackService) performWhack(req WhackRequest) (bool, int, bool) {
	ws.mu.Lock()
	defer ws.mu.Unlock()

	// Time-based combo multiplier
	timeSinceLastWhack := time.Since(ws.lastWhackTime)
	ws.lastWhackTime = time.Now()

	stylePoints := 0
	moleEscaped := false

	// Check if mole is present (random for demo)
	molePresent := rand.Float64() > 0.3

	if !molePresent {
		// Missed - no mole here
		return false, -10, false
	}

	// Quantum tunneling escape chance
	if rand.Float64() > 0.95 {
		// FIXME: Moles shouldn't be able to quantum tunnel
		moleEscaped = true
		return false, 0, true
	}

	// Calculate success based on hammer type and force
	successChance := 0.7
	if ws.config.HammerType == "foam" {
		successChance = 0.6 // Safer but less effective
	}
	if req.Force == "gentle" {
		successChance *= 0.8
	} else if req.Force == "maximum" {
		successChance = 0.95
		stylePoints += 20
	}

	success := rand.Float64() < successChance

	if success {
		// Calculate style points
		stylePoints += ws.calculateStylePoints(req, timeSinceLastWhack)
	}

	return success, stylePoints, moleEscaped
}

// calculateStylePoints awards points for style
func (ws *WhackService) calculateStylePoints(req WhackRequest, timeSinceLastWhack time.Duration) int {
	points := 10 // Base points

	// Combo bonus
	if timeSinceLastWhack < 500*time.Millisecond {
		points += 30 // Quick succession bonus
	}

	// Perfect center hit
	if req.X == 50 && req.Y == 50 {
		points += 15
	}

	// Edge hit (harder)
	if req.X < 10 || req.X > 90 || req.Y < 10 || req.Y > 90 {
		points += 25
	}

	// Random critical hit
	if rand.Float64() > 0.9 {
		points *= 2 // CRITICAL HIT!
	}

	// The answer to everything
	if req.X == 42 || req.Y == 42 {
		points = 100 // Perfect score
	}

	return points
}

// generateWhackMessage creates a fun response message
func (ws *WhackService) generateWhackMessage(success bool, stylePoints int, moleEscaped bool) string {
	if moleEscaped {
		messages := []string{
			"The mole quantum tunneled away!",
			"Mole used ESCAPE! It's super effective!",
			"The mole vanished into another dimension!",
			"ERROR: Mole.exe has stopped responding",
		}
		return messages[rand.Intn(len(messages))]
	}

	if !success {
		messages := []string{
			"Swing and a miss!",
			"The mole laughs at your attempt",
			"Better luck next time!",
			"404: Mole not found at these coordinates",
		}
		return messages[rand.Intn(len(messages))]
	}

	if stylePoints > 50 {
		return "SPECTACULAR WHACK! The crowd goes wild!"
	} else if stylePoints > 30 {
		return "Nice whack! Very stylish!"
	} else if stylePoints == 100 {
		return "PERFECT! You've achieved mole-whacking enlightenment!"
	}

	return "Whack successful! Mole neutralized."
}

// GetStatistics returns whacking statistics
func (ws *WhackService) GetStatistics() map[string]interface{} {
	return map[string]interface{}{
		"total_whacks":      atomic.LoadInt64(&ws.totalWhacks),
		"successful_whacks": atomic.LoadInt64(&ws.successfulWhacks),
		"mole_escapes":      atomic.LoadInt64(&ws.moleEscapes),
		"success_rate":      float64(ws.successfulWhacks) / float64(ws.totalWhacks+1) * 100,
		"hammer_type":       ws.config.HammerType,
		"whack_speed":       ws.config.WhackSpeed,
	}
}