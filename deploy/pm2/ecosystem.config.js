module.exports = {
  apps: [
    {
      name: 'malmil-api',
      cwd: '../backend-malmil',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        APP_PORT: 3010,
      },
      env_file: '../.env',
      watch: false,
      max_memory_restart: '500M',
      error_file: '../logs/api-error.log',
      out_file: '../logs/api-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 10000,
      listen_timeout: 8000,
      shutdown_with_message: true,
    },
  ],
};
