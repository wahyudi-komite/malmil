module.exports = {
  apps: [
    {
      name: 'malmil-api',
      cwd: '../backend-malmil',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
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
