#!/bin/bash

# UTC Transport Chatbot - Database & Auth Setup Script
# This script helps you quickly set up the database and authentication system

set -e  # Exit on error

echo "=========================================="
echo "🚀 UTC Chatbot Database Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Python 3 found"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  PostgreSQL client not found. Make sure PostgreSQL is installed."
fi

# Step 1: Create .env file if not exists
echo ""
echo "Step 1: Configuration"
echo "---------------------"
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓${NC} .env file created. Please edit it with your database credentials."
    echo ""
    echo "Default configuration:"
    echo "  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transport_chatbot"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to exit and edit .env first..."
else
    echo -e "${GREEN}✓${NC} .env file already exists"
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing Python dependencies"
echo "--------------------------------------"
read -p "Install/upgrade dependencies? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    pip install -r requirements.txt
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo "Skipped dependency installation"
fi

# Step 3: Create database
echo ""
echo "Step 3: Database Creation"
echo "------------------------"
read -p "Do you want to create the PostgreSQL database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter database name (default: transport_chatbot): " dbname
    dbname=${dbname:-transport_chatbot}
    
    read -p "Enter PostgreSQL username (default: postgres): " dbuser
    dbuser=${dbuser:-postgres}
    
    echo "Creating database '$dbname'..."
    createdb -U $dbuser $dbname 2>/dev/null && echo -e "${GREEN}✓${NC} Database created" || echo -e "${YELLOW}⚠${NC}  Database may already exist"
fi

# Step 4: Initialize database
echo ""
echo "Step 4: Initialize Database Tables & Seed Data"
echo "----------------------------------------------"
read -p "Do you want to initialize the database? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Reset existing data? (⚠️  This will DELETE all data!) (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python -m app.scripts.init_db --reset
    else
        python -m app.scripts.init_db
    fi
    echo -e "${GREEN}✓${NC} Database initialized"
fi

# Step 5: Run demo
echo ""
echo "Step 5: Test Installation"
echo "------------------------"
read -p "Run authentication demo? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python -m app.examples.auth_demo
fi

# Summary
echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Default login credentials:"
echo "   Username: admin"
echo "   Password: Admin@123"
echo ""
echo "📚 Next steps:"
echo "   1. Review DATABASE_AUTH_README.md for detailed documentation"
echo "   2. Edit .env file with your configuration"
echo "   3. Integrate with your FastAPI routes"
echo "   4. Start building your chatbot!"
echo ""
echo "🚀 To start the server:"
echo "   uvicorn app.main:app --reload"
echo ""
