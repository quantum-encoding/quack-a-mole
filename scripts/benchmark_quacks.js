#!/usr/bin/env node

/**
 * Quack Performance Benchmark Script
 * Measures the maximum quacks per second (QPS) the system can handle
 */

const http = require('http');

console.log('🏁 Quack Performance Benchmark v1.0');
console.log('=====================================\n');

const DURATION_SECONDS = 10;
const CONCURRENT_QUACKERS = 10;

let totalQuacks = 0;
let successfulQuacks = 0;
let failedQuacks = 0;
let quantumInterference = 0;

function sendQuack() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/quack?intensity=maximum',
            method: 'POST'
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                successfulQuacks++;
            } else if (res.statusCode === 404) {
                // Quack got stuck in another dimension
                quantumInterference++;
            } else {
                failedQuacks++;
            }
            totalQuacks++;
            resolve();
        });

        req.on('error', (error) => {
            failedQuacks++;
            totalQuacks++;
            resolve(); // Don't reject, keep benchmarking
        });

        req.end();
    });
}

async function runQuacker(id) {
    const startTime = Date.now();
    let localQuacks = 0;

    console.log(`🦆 Quacker ${id} started...`);

    while ((Date.now() - startTime) < DURATION_SECONDS * 1000) {
        await sendQuack();
        localQuacks++;
        
        // Add some randomness to simulate real ducks
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    }

    console.log(`🦆 Quacker ${id} finished with ${localQuacks} quacks`);
    return localQuacks;
}

async function runBenchmark() {
    console.log(`⏱️  Running ${DURATION_SECONDS} second benchmark with ${CONCURRENT_QUACKERS} concurrent quackers...\n`);

    const startTime = Date.now();
    const quackerPromises = [];

    // Launch concurrent quackers
    for (let i = 1; i <= CONCURRENT_QUACKERS; i++) {
        quackerPromises.push(runQuacker(i));
    }

    // Wait for all quackers to finish
    await Promise.all(quackerPromises);

    const duration = (Date.now() - startTime) / 1000;
    const qps = totalQuacks / duration;

    console.log('\n📊 Benchmark Results:');
    console.log('====================');
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(`🦆 Total Quacks: ${totalQuacks}`);
    console.log(`✅ Successful: ${successfulQuacks}`);
    console.log(`❌ Failed: ${failedQuacks}`);
    console.log(`🌀 Quantum Interference: ${quantumInterference}`);
    console.log(`📈 Quacks Per Second (QPS): ${qps.toFixed(2)}`);
    console.log(`🎯 Success Rate: ${((successfulQuacks / totalQuacks) * 100).toFixed(2)}%`);

    // Performance rating
    console.log('\n🏆 Performance Rating:');
    if (qps > 1000) {
        console.log('   🔥 BLAZINGLY FAST! Your ducks are quantum-entangled!');
    } else if (qps > 500) {
        console.log('   ⚡ Excellent! Your ducks are well-trained!');
    } else if (qps > 100) {
        console.log('   👍 Good! Your ducks are performing adequately.');
    } else if (qps > 50) {
        console.log('   🐢 Slow. Your ducks might be sleepy.');
    } else {
        console.log('   💤 Very slow. Check if your ducks are awake.');
    }

    // Easter egg
    if (quantumInterference > totalQuacks * 0.1) {
        console.log('\n⚠️  WARNING: High quantum interference detected!');
        console.log('   Consider recalibrating your quantum quacker.');
    }

    if (Math.random() > 0.9) {
        console.log('\n🐙 The Quacken observed your benchmark with interest...');
    }
}

// Check if backend is running
console.log('🔍 Checking if backend is running...');
http.get('http://localhost:8080/api/pond/status', (res) => {
    if (res.statusCode === 200) {
        console.log('✅ Backend is ready!\n');
        runBenchmark().catch(console.error);
    } else {
        console.error('❌ Backend returned status:', res.statusCode);
        process.exit(1);
    }
}).on('error', (err) => {
    console.error('❌ Backend is not running!');
    console.error('   Please run: docker-compose up -d');
    process.exit(1);
});