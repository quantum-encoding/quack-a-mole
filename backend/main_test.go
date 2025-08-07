package main

import (
	"testing"
	"quack-a-mole/internal/quacker"
)

func TestInitializeDuckAI(t *testing.T) {
	duck, err := InitializeDuckAI()
	if err != nil {
		t.Fatalf("Failed to initialize Duck AI: %v", err)
	}
	
	if duck == nil {
		t.Fatal("Expected quantum quacker, got nil")
	}
	
	// Test that we can emit a quack without panic
	err = duck.EmitQuack(100.0, quacker.QUANTUM_ENTANGLED)
	if err != nil {
		t.Errorf("Failed to emit quantum quack: %v", err)
	}
}

func TestDispatchQuantumQuack(t *testing.T) {
	q, _ := quacker.NewQuantumQuacker(quacker.Config{
		QuackAmplitude: 11,
		QuantumState:   "superposition",
		MoleDetection:  true,
	})
	
	err := DispatchQuantumQuack(q, 42.0)
	if err != nil {
		t.Errorf("Failed to dispatch quantum quack: %v", err)
	}
}