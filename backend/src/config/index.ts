import { config as dotenvConfig } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(dotenvConfig());

export interface Config {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  databaseUrl: string;
  redisUrl: string;
  redisTtl: number;
  minioEndpoint: string;
  minioPort: number;
  minioUseSsl: boolean;
  minioAccessKey: string;
  minioSecretKey: string;
  minioBucket: string;
  minioRegion: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpires: string;
  jwtRefreshExpires: string;
  sessionSecret: string;
  argon2: {
    timeCost: number;
    memoryCost: number;
    parallelism: number;
    hashLength: number;
    saltLength: number;
  };
  otp: {
    length: number;
    expiresInSeconds: number;
    maxAttempts: number;
    cooldownSeconds: number;
  };
  sms: {
    provider: string;
    consoleEnabled: boolean;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioFrom?: string;
  };
  email: {
    provider: string;
    consoleEnabled: boolean;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
  };
  matching: {
    thresholdHigh: number;
    thresholdLow: number;
    timeWindowDays: number;
    maxCandidates: number;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  frontendUrlCitizen: string;
  frontendUrlAgent: string;
  frontendUrlAdmin: string;
}

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const val = process.env[key];
  if (!val) return defaultValue;
  const parsed = parseInt(val, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const val = process.env[key];
  if (!val) return defaultValue;
  return val === 'true' || val === '1';
}

export const config: Config = {
  nodeEnv: getEnv('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 3000),
  apiPrefix: getEnv('API_PREFIX', '/api/v1'),
  databaseUrl: getEnv('DATABASE_URL', ''),
  redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),
  redisTtl: getEnvNumber('REDIS_TTL_SECONDS', 3600),
  minioEndpoint: getEnv('MINIO_ENDPOINT', 'localhost'),
  minioPort: getEnvNumber('MINIO_PORT', 9000),
  minioUseSsl: getEnvBoolean('MINIO_USE_SSL', false),
  minioAccessKey: getEnv('MINIO_ACCESS_KEY', ''),
  minioSecretKey: getEnv('MINIO_SECRET_KEY', ''),
  minioBucket: getEnv('MINIO_BUCKET_MRT', 'mrt-dev'),
  minioRegion: getEnv('MINIO_REGION', 'us-east-1'),
  jwtSecret: getEnv('JWT_SECRET', 'dev-jwt-secret'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET', 'dev-jwt-refresh-secret'),
  jwtAccessExpires: getEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  jwtRefreshExpires: getEnv('JWT_REFRESH_EXPIRES_IN', '8h'),
  sessionSecret: getEnv('SESSION_SECRET', 'dev-session-secret'),
  argon2: {
    timeCost: getEnvNumber('ARGON2_TIME_COST', 3),
    memoryCost: getEnvNumber('ARGON2_MEMORY_COST', 65536),
    parallelism: getEnvNumber('ARGON2_PARALLELISM', 1),
    hashLength: getEnvNumber('ARGON2_HASH_LENGTH', 32),
    saltLength: getEnvNumber('ARGON2_SALT_LENGTH', 16),
  },
  otp: {
    length: getEnvNumber('OTP_LENGTH', 6),
    expiresInSeconds: getEnvNumber('OTP_EXPIRES_IN_SECONDS', 300),
    maxAttempts: getEnvNumber('OTP_MAX_ATTEMPTS', 3),
    cooldownSeconds: getEnvNumber('OTP_COOLDOWN_SECONDS', 60),
  },
  sms: {
    provider: getEnv('SMS_PROVIDER', 'console'),
    consoleEnabled: getEnvBoolean('SMS_CONSOLE_ENABLED', true),
    twilioAccountSid: process.env.SMS_TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.SMS_TWILIO_AUTH_TOKEN,
    twilioFrom: process.env.SMS_TWILIO_FROM,
  },
  email: {
    provider: getEnv('EMAIL_PROVIDER', 'console'),
    consoleEnabled: getEnvBoolean('EMAIL_CONSOLE_ENABLED', true),
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  },
  matching: {
    thresholdHigh: getEnvNumber('MATCHING_THRESHOLD_HIGH', 80),
    thresholdLow: getEnvNumber('MATCHING_THRESHOLD_LOW', 50),
    timeWindowDays: getEnvNumber('MATCHING_TIME_WINDOW_DAYS', 60),
    maxCandidates: getEnvNumber('MATCHING_MAX_CANDIDATES', 10),
  },
  rateLimit: {
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 60000),
    max: getEnvNumber('RATE_LIMIT_MAX', 100),
  },
  frontendUrlCitizen: getEnv('FRONTEND_URL_CITIZEN', 'http://localhost:5173'),
  frontendUrlAgent: getEnv('FRONTEND_URL_AGENT', 'http://localhost:5174'),
  frontendUrlAdmin: getEnv('FRONTEND_URL_ADMIN', 'http://localhost:5175'),
};
