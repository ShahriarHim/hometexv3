# Quick Deployment Guide

## Step 1: Make Script Executable

```bash
# Navigate to project directory
cd ~/hometexv3

# Make script executable
chmod +x deploy.sh

# Verify it's executable
ls -la deploy.sh
```

## Step 2: Run Deployment

**Option A: Without sudo (Recommended)**

```bash
./deploy.sh
```

**Option B: With sudo (if needed for npm install)**

```bash
sudo ./deploy.sh
```

**Option C: Using bash explicitly**

```bash
bash deploy.sh
```

## Step 3: If Script Not Found

If you get "command not found", try:

```bash
# Use full path
bash ~/hometexv3/deploy.sh

# Or navigate first
cd ~/hometexv3
bash deploy.sh
```

## Step 4: Manual Deployment (Alternative)

If the script doesn't work, run these commands manually:

```bash
# Navigate to project
cd ~/hometexv3

# Install dependencies
npm install --production

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Or if ecosystem.config.js doesn't work:
pm2 start npm --name "hometex-v3" -- start

# Save PM2 config
pm2 save

# Check status
pm2 status
pm2 logs hometex-v3
```

## Step 5: Setup PM2 on System Boot

```bash
# Generate startup script
pm2 startup

# Follow the instructions shown (usually involves running a sudo command)
# Then save current PM2 processes
pm2 save
```

## Troubleshooting

### Script Permission Denied

```bash
chmod +x deploy.sh
```

### PM2 Not Found

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process if needed
sudo kill -9 <PID>
```

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs hometex-v3

# Monitor resources
pm2 monit
```

## Next Steps After Deployment

1. **Setup Nginx** (if not done):
   - See full deployment guide for Nginx configuration
   - Configure reverse proxy to port 3000

2. **Setup SSL**:
   - Install certbot: `sudo apt install certbot python3-certbot-nginx`
   - Get certificate: `sudo certbot --nginx -d yourdomain.com`

3. **Configure Firewall**:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

## Environment Variables

Make sure you have `.env.production` file with:

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
API_BASE_URL=https://your-api-url.com
```

## Verify Deployment

1. Check if app is running:

   ```bash
   curl http://localhost:3000
   ```

2. Check PM2:

   ```bash
   pm2 status
   ```

3. Check logs:
   ```bash
   pm2 logs hometex-v3 --lines 50
   ```
