#!/bin/bash

# Start PostgreSQL service
sudo systemctl stop postgresql

echo "PostgreSQL service stopped successfully."

sudo systemctl stop apache2

echo "Apache2 server stopped successfully. The web link can be found at http://127.0.0.1/pgadmin4"