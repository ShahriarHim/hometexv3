#!/bin/bash

# Hometex V3 - Quick Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Build application
echo -e "${GREEN}Building application...${NC}"
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo -e "${RED}Build failed! .next directory not found.${NC}"
    exit 1
fi

# Restart PM2
if pm2 list | grep -q "hometex-v3"; then
    echo -e "${GREEN}Restarting PM2 application...${NC}"
    pm2 restart hometex-v3
else
    echo -e "${GREEN}Starting PM2 application...${NC}"
    pm2 start ecosystem.config.js || pm2 start npm --name "hometex-v3" -- start
fi

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}Check status with: pm2 status${NC}"
echo -e "${YELLOW}View logs with: pm2 logs hometex-v3${NC}"
