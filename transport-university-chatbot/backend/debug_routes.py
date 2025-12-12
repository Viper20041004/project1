import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.main import app

print("Registered Routes:")
for route in app.routes:
    print(f"Path: {route.path} - Name: {route.name} - Methods: {route.methods}")
