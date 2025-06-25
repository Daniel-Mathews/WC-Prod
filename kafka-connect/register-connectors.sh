#!/bin/bash
# Wait for Kafka Connect to be ready
echo "Waiting for Kafka Connect to be ready..."
sleep 20

# Register source connector
echo "Registering source connector..."
curl -X POST -H "Content-Type: application/json" --data @/kafka/connectors/source-postgres.json http://localhost:8083/connectors

# Register sink connector
echo "Registering sink connector..."
curl -X POST -H "Content-Type: application/json" --data @/kafka/connectors/sink-postgres.json http://localhost:8083/connectors

tail -f /dev/null  # Keep container running
