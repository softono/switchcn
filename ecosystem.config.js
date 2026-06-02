module.exports = {
  apps: [
    {
      name: "switchcn",
      script: "npm",
      args: "run start",
      cwd: "/media/creator/ssd/www/hosting/switchcn",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "256M",

      env: {
        NODE_ENV: "production",
        PORT: 4001
      }
    }
  ]
};