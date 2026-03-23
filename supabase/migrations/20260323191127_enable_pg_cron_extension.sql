/*
  # Enable pg_cron Extension

  Enables the pg_cron job scheduler so that scheduled tasks can run directly
  inside the PostgreSQL database on a cron-like schedule.
*/

CREATE EXTENSION IF NOT EXISTS pg_cron;