module.exports = {
  apps: [
    {
      name: "hometex-v3",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: process.cwd(),
      instances: 2, // Use 2 instances for load balancing
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_BASE_URL: "https://api.hometexbd.ltd",
        NEXT_PUBLIC_SITE_URL: "https://www.hometexbd.ltd",
        NEXT_PUBLIC_APP_NAME: "Hometex Bangladesh",
      },
      env_staging: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_API_BASE_URL: "https://staging-api.hometexbd.ltd",
        NEXT_PUBLIC_SITE_URL: "https://staging.hometexbd.ltd",
        NEXT_PUBLIC_APP_NAME: "Hometex Bangladesh [STAGING]",
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      min_uptime: "10s",
      max_restarts: 10,
      watch: false,
      ignore_watch: ["node_modules", ".next", "logs"],
    },
  ],
};
