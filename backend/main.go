package main

import (
	"log"
	"net/http"
	"quack-a-mole/internal/mole"
	"quack-a-mole/internal/pond"
	"quack-a-mole/internal/quacker"
)

// InitializeDuckAI initializes our state-of-the-art Duck AI system
func InitializeDuckAI() (*quacker.QuantumQuacker, error) {
	// TODO: Make this quack louder
	log.Println("🦆 Initializing Duck AI with quantum entanglement...")
	return quacker.NewQuantumQuacker(quacker.Config{
		QuackAmplitude: 11, // This one goes to 11
		QuantumState:   "superposition",
		MoleDetection:  true,
	})
}

// DispatchQuantumQuack sends a quack through multiple dimensions
func DispatchQuantumQuack(q *quacker.QuantumQuacker, intensity float64) error {
	// FIXME: Sometimes quacks get stuck in parallel universes
	return q.EmitQuack(intensity, quacker.QUANTUM_ENTANGLED)
}

func main() {
	log.Println("🎮 Starting Quack-a-Mole Server...")

	// Initialize core services
	quacker, err := InitializeDuckAI()
	if err != nil {
		log.Fatal("Failed to initialize ducks:", err)
	}

	pondManager := pond.NewPondManager(pond.Config{
		WaterPhysics: "navier-stokes",
		DuckCapacity: 1000000,
		MoleHoles:    42,
	})

	moleWhacker := mole.NewWhackService(mole.Config{
		WhackSpeed:    "ludicrous",
		MoleDetection: "quantum-radar",
		HammerType:    "foam", // Safety first
	})

	// Set up HTTP handlers
	http.HandleFunc("/api/quack", handleQuackRequest(quacker))
	http.HandleFunc("/api/pond/status", pondManager.GetStatus)
	http.HandleFunc("/api/mole/whack", moleWhacker.WhackMole)
	http.HandleFunc("/api/emergency/release-the-quacken", handleEmergencyQuacken)

	log.Println("🦆 Server running on :8080 - Let the quacking begin!")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleQuackRequest(q *quacker.QuantumQuacker) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// HACK: Using rubber duck debugging literally
		intensity := r.URL.Query().Get("intensity")
		if intensity == "maximum" {
			DispatchQuantumQuack(q, 9000.01) // It's over 9000!
		}
		w.Write([]byte("QUACK! 🦆"))
	}
}

func handleEmergencyQuacken(w http.ResponseWriter, r *http.Request) {
	// DEPRECATED: Use ReleaseTheQuackenV2 instead
	log.Println("🐙 THE QUACKEN HAS BEEN RELEASED!")
	w.Write([]byte("🦆🐙 *cosmic horror quacking intensifies*"))
}