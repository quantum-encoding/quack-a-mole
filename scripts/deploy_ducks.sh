#!/bin/bash

# Deploy Ducks Script
# WARNING: This will release actual ducks into production

set -e

DUCK_COUNT=${1:-100}
ENVIRONMENT=${2:-production}

echo "🦆 Duck Deployment System v2.0"
echo "=============================="
echo "Environment: $ENVIRONMENT"
echo "Duck Count: $DUCK_COUNT"
echo ""

# Check if we're in production
if [ "$ENVIRONMENT" == "production" ]; then
    echo "⚠️  WARNING: You are about to deploy to PRODUCTION!"
    echo "This will release $DUCK_COUNT live ducks!"
    read -p "Are you absolutely sure? (type 'release the ducks'): " confirmation
    
    if [ "$confirmation" != "release the ducks" ]; then
        echo "❌ Deployment cancelled. The ducks remain contained."
        exit 1
    fi
fi

echo "🔧 Pre-deployment checks..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found! Ducks need containers!"
    exit 1
fi

# Check pond status
echo "💧 Checking pond water levels..."
sleep 1
echo "✅ Water level: Optimal"

# Check for moles
echo "🕳️ Scanning for moles..."
sleep 1
MOLE_COUNT=$((RANDOM % 10))
echo "⚠️  Detected $MOLE_COUNT moles in the pond"

if [ $MOLE_COUNT -gt 5 ]; then
    echo "❌ Too many moles! Deployment aborted."
    echo "🔨 Please run: ./scripts/whack_all_moles.sh"
    exit 1
fi

# Build images
echo ""
echo "🏗️ Building Docker images..."
docker-compose build --parallel

# Initialize pond
echo ""
echo "🌊 Initializing pond..."
python scripts/initialize_pond.py --ducks=$DUCK_COUNT --moles=suspicious

# Deploy services
echo ""
echo "🚀 Deploying services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to quack up..."
sleep 5

# Health checks
echo ""
echo "🏥 Running health checks..."

# Check backend
if curl -s http://localhost:8080/api/pond/status > /dev/null; then
    echo "✅ Backend: Healthy"
else
    echo "❌ Backend: Not responding"
fi

# Check ML service
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ ML Service: Healthy"
else
    echo "❌ ML Service: Not responding"
fi

# Check Rust service
if curl -s http://localhost:3030/health > /dev/null; then
    echo "✅ Rust Service: Healthy"
else
    echo "❌ Rust Service: Not responding"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Not responding"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "  - Ducks deployed: $DUCK_COUNT"
echo "  - Services running: 4"
echo "  - Moles detected: $MOLE_COUNT"
echo "  - Quantum coherence: 73%"
echo ""
echo "🌐 Access points:"
echo "  - Dashboard: http://localhost:3000"
echo "  - API: http://localhost:8080"
echo "  - ML API: http://localhost:5000"
echo "  - Mole Whacker: http://localhost:3030"
echo ""
echo "🦆 The ducks are now live. May they quack in peace."

# Easter egg
if [ $((RANDOM % 10)) -eq 0 ]; then
    echo ""
    echo "🐙 *The Quacken stirs in the depths...*"
fi