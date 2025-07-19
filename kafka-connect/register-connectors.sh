#!/bin/bash

echo "[INFO] Waiting for Kafka Connect to be ready..."

# Wait until port 8083 is open inside the container
while ! curl -s http://localhost:8083/connectors; do
  echo "[INFO] Kafka Connect not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "[INFO] Kafka Connect REST API is up. Registering connectors..."

# Register source
curl -X POST -H "Content-Type: application/json" \
  --data @/kafka/connectors/source-postgres.json \
  http://localhost:8083/connectors

# Register sink
curl -X POST -H "Content-Type: application/json" \
  --data @/kafka/connectors/sink-postgres.json \
  http://localhost:8083/connectors