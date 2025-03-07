#!/bin/bash

# Start PostgreSQL service
sudo systemctl start postgresql

echo "PostgreSQL service started successfully."

sudo systemctl start apache2

echo "Apache2 server started successfully. The web link can be found at http://127.0.0.1/pgadmin4"