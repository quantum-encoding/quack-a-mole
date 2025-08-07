mod mole_whacker;

use axum::{
    routing::{get, post},
    Router,
    Json,
};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use mole_whacker::MoleWhacker;
use std::sync::Arc;
use tokio::sync::RwLock;

#[tokio::main]
async fn main() {
    println!("🦀 Rust Mole Whacker Service Starting...");
    println!("⚡ SIMD optimizations: ENABLED (just kidding)");
    println!("🔨 Hammer type: FOAM (safety first)");
    
    let mole_whacker = Arc::new(RwLock::new(MoleWhacker::new()));
    
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/whack", post({
            let whacker = Arc::clone(&mole_whacker);
            move |body| async move { 
                mole_whacker::handle_whack(whacker, body).await 
            }
        }))
        .route("/detect", get({
            let whacker = Arc::clone(&mole_whacker);
            move || async move { 
                mole_whacker::detect_moles(whacker).await 
            }
        }))
        .route("/stats", get({
            let whacker = Arc::clone(&mole_whacker);
            move || async move { 
                mole_whacker::get_stats(whacker).await 
            }
        }))
        .layer(CorsLayer::permissive());
    
    let addr = SocketAddr::from(([0, 0, 0, 0], 3030));
    println!("🚀 Mole Whacker listening on {}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "mole-whacker",
        "version": "1.0.0",
        "performance": "blazingly fast 🔥"
    }))
}