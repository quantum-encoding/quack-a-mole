# Quack-a-Mole Makefile
# Commands for managing your duck fleet

.PHONY: help
help: ## Show this help message
	@echo "🦆 Quack-a-Mole Command Center"
	@echo "=============================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Example: make deploy-ducks"

.PHONY: install
install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd backend && go mod download
	cd ml-service && pip install -r requirements.txt
	cd frontend && npm install
	cd rust-service && cargo build
	@echo "✅ All dependencies installed!"

.PHONY: build
build: ## Build all Docker images
	@echo "🏗️ Building Docker images..."
	docker-compose build --parallel
	@echo "✅ All images built!"

.PHONY: up
up: ## Start all services
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ All services running!"
	@echo "Dashboard: http://localhost:3000"

.PHONY: down
down: ## Stop all services
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ All services stopped!"

.PHONY: restart
restart: down up ## Restart all services
	@echo "🔄 Services restarted!"

.PHONY: logs
logs: ## Show logs from all services
	docker-compose logs -f

.PHONY: logs-backend
logs-backend: ## Show backend logs
	docker-compose logs -f backend

.PHONY: logs-ml
logs-ml: ## Show ML service logs
	docker-compose logs -f ml-service

.PHONY: logs-rust
logs-rust: ## Show Rust service logs
	docker-compose logs -f rust-service

.PHONY: logs-frontend
logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

.PHONY: test
test: ## Run all tests
	@echo "🧪 Running tests..."
	@echo "Testing Go backend..."
	cd backend && go test ./...
	@echo "Testing Rust service..."
	cd rust-service && cargo test
	@echo "Testing frontend..."
	cd frontend && npm test -- --passWithNoTests
	@echo "✅ All tests passed!"

.PHONY: benchmark
benchmark: ## Run performance benchmarks
	@echo "📊 Running benchmarks..."
	node scripts/benchmark_quacks.js

.PHONY: init-pond
init-pond: ## Initialize the pond with ducks
	@echo "🌊 Initializing pond..."
	python scripts/initialize_pond.py --ducks=100 --moles=suspicious

.PHONY: deploy-ducks
deploy-ducks: ## Deploy ducks to production
	@echo "🦆 Deploying ducks..."
	./scripts/deploy_ducks.sh 100 production

.PHONY: release-quacken
release-quacken: ## EMERGENCY: Release the Quacken
	@echo "🐙 WARNING: You are about to release the Quacken!"
	@echo "This action cannot be undone!"
	@read -p "Type 'release the quacken' to confirm: " confirm; \
	if [ "$$confirm" = "release the quacken" ]; then \
		echo "🐙 THE QUACKEN HAS BEEN RELEASED!"; \
		curl -X POST http://localhost:8080/api/emergency/release-the-quacken; \
	else \
		echo "❌ Quacken remains sealed."; \
	fi

.PHONY: status
status: ## Check system status
	@echo "📊 System Status"
	@echo "==============="
	@curl -s http://localhost:8080/api/pond/status | python -m json.tool || echo "❌ Backend not responding"
	@curl -s http://localhost:5000/health | python -m json.tool || echo "❌ ML service not responding"
	@curl -s http://localhost:3030/health | python -m json.tool || echo "❌ Rust service not responding"

.PHONY: clean
clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	rm -rf backend/main
	rm -rf ml-service/__pycache__
	rm -rf rust-service/target
	rm -rf frontend/build
	rm -rf frontend/node_modules
	@echo "✅ Cleaned!"

.PHONY: reset
reset: down clean ## Full system reset
	@echo "♻️ System reset complete!"
	@echo "Run 'make install' to reinstall dependencies"

.PHONY: analyze
analyze: ## Run codebase analysis with codebase_deity
	@echo "🔍 Analyzing codebase..."
	codebase_deity --path . --comprehensive --semantic --patterns --visualize

.PHONY: dev
dev: ## Start development environment
	@echo "💻 Starting development environment..."
	@echo "Starting backend..."
	cd backend && go run main.go &
	@echo "Starting ML service..."
	cd ml-service && python duck_ai.py &
	@echo "Starting Rust service..."
	cd rust-service && cargo run &
	@echo "Starting frontend..."
	cd frontend && npm start &
	@echo "✅ Development environment running!"

.PHONY: monitor
monitor: ## Open monitoring dashboard
	@echo "📈 Opening monitoring dashboard..."
	@open http://localhost:3000 || xdg-open http://localhost:3000 || echo "Please open http://localhost:3000"

.PHONY: whack-all-moles
whack-all-moles: ## Whack all moles in the system
	@echo "🔨 Initiating global mole whacking..."
	@for i in {1..100}; do \
		curl -s -X POST http://localhost:3030/whack \
			-H "Content-Type: application/json" \
			-d '{"x": '$$((RANDOM % 100))', "y": '$$((RANDOM % 100))', "force": "maximum"}' \
			> /dev/null; \
	done
	@echo "✅ All moles whacked!"

.PHONY: easter-egg
easter-egg: ## ???
	@echo "🥚 You found the easter egg!"
	@echo "🦆 The ducks are pleased with your curiosity."
	@echo "🎁 Your reward: Knowledge that the ducks are always watching."
	@echo ""
	@echo "     __         __"
	@echo "    (\\ \\       / /)"
	@echo "     \\ \\_____/ /"
	@echo "      \\  o o  /"
	@echo "       |  >  |"
	@echo "       | --- |"
	@echo "       |_____|"
	@echo "    🦆 QUACK! 🦆"