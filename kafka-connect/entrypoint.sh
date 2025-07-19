#!/bin/bash

# Start Kafka Connect in background
connect-distributed /kafka/config/connect-distributed.properties &

# Wait for Kafka Connect REST API
echo "[INFO] Waiting for Kafka Connect REST API (localhost:8083)..."
until curl -s http://localhost:8083/; do
  echo "[INFO] Kafka Connect not ready yet. Retrying in 2s..."
  sleep 2
done

echo "[INFO] Kafka Connect is ready. Registering connectors..."
/kafka/register-connectors.sh

wait

