import requests
import time
import os
import json

KAFKA_CONNECT_URL = "http://kafka-connect:8083/connectors"
CONNECTORS_DIR = "/connectors"

def wait_for_connect():
    print("[INFO] Waiting for Kafka Connect REST API...")
    while True:
        try:
            r = requests.get("http://kafka-connect:8083/")
            if r.status_code == 200:
                print("[INFO] Kafka Connect is available.")
                return
        except:
            pass
        print("[WAIT] Not ready yet. Sleeping 2s...")
        time.sleep(2)

def register_connector(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    name = data.get("name", "unnamed-connector")
    print(f"[INFO] Registering connector: {name}")
    r = requests.post(KAFKA_CONNECT_URL, json=data)
    if r.status_code in [200, 201]:
        print(f"[SUCCESS] Registered: {name}")
    elif r.status_code == 409:
        print(f"[INFO] Already exists: {name}")
    else:
        print(f"[ERROR] Failed to register {name}: {r.status_code}")
        print(f"[RESPONSE] {r.text}")


def main():
    wait_for_connect()
    for filename in os.listdir(CONNECTORS_DIR):
        if filename.endswith(".json"):
            register_connector(os.path.join(CONNECTORS_DIR, filename))

if __name__ == "__main__":
    main()
