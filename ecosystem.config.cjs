module.exports = {
  apps: [
    {
      name: "hometex-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/hometexv3",
      exec_mode: "cluster",
      instances: 2,
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false
    },
    {
      name: "hometex-staging",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/var/www/hometexv3-staging",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production"
      },
      autorestart: true,
      watch: false
    }
  ]
};
