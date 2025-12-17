#!/bin/bash

# Hometex V3 - Quick Deployment Script
# Usage:
#   ./deploy.sh                  # Deploy to production
#   ./deploy.sh staging          # Deploy to staging
#   ./deploy.sh production       # Deploy to production (explicit)

set -e

# Determine environment
ENVIRONMENT=${1:-production}

if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
    echo "Invalid environment: $ENVIRONMENT"
    echo "Usage: ./deploy.sh [production|staging]"
    exit 1
fi

echo "🚀 Starting $ENVIRONMENT deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root (warn but allow for sudo usage)
if [ "$EUID" -eq 0 ]; then
   echo -e "${YELLOW}Warning: Running as root. Consider running without sudo.${NC}"
   echo -e "${YELLOW}Continuing anyway...${NC}"
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing...${NC}"
    if [ "$EUID" -eq 0 ]; then
        npm install -g pm2
    else
        sudo npm install -g pm2
    fi
fi

# Install dependencies (including devDependencies needed for build)
echo -e "${GREEN}Installing dependencies (including devDependencies for build)...${NC}"
npm install

# Load environment-specific variables
if [ -f ".env.$ENVIRONMENT" ]; then
    echo -e "${BLUE}Loading environment from .env.$ENVIRONMENT...${NC}"
    # Copy environment file for build
    cp ".env.$ENVIRONMENT" .env.production.local
else
    echo -e "${YELLOW}Warning: .env.$ENVIRONMENT not found. Using existing .env configuration.${NC}"
fi

# Build application
echo -e "${GREEN}Building application for $ENVIRONMENT...${NC}"
NODE_ENV=production npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo -e "${RED}Build failed! .next directory not found.${NC}"
    exit 1
fi

# Restart PM2 with environment
if pm2 list | grep -q "hometex-v3"; then
    echo -e "${GREEN}Restarting PM2 application with $ENVIRONMENT config...${NC}"
    pm2 restart ecosystem.config.js --env $ENVIRONMENT
else
    echo -e "${GREEN}Starting PM2 application with $ENVIRONMENT config...${NC}"
    pm2 start ecosystem.config.js --env $ENVIRONMENT
fi

# Save PM2 configuration
pm2 save

echo ""
echo -e "${GREEN}✅ $ENVIRONMENT deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  ${YELLOW}pm2 status${NC}              - Check application status"
echo -e "  ${YELLOW}pm2 logs hometex-v3${NC}     - View application logs"
echo -e "  ${YELLOW}pm2 monit${NC}               - Monitor resources"
echo -e "  ${YELLOW}pm2 restart hometex-v3${NC}  - Restart application"
echo ""
echo -e "${BLUE}Environment info:${NC}"
echo -e "  Deployed to: ${GREEN}$ENVIRONMENT${NC}"
echo -e "  PM2 env:     ${GREEN}--env $ENVIRONMENT${NC}"
echo ""
