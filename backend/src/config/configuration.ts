const defaultDatabaseUrl = 'postgresql://postgres:postgres@127.0.0.1:5432/eeeco?schema=public';
const configuredDatabaseUrl = process.env.DATABASE_URL?.trim() || defaultDatabaseUrl;
const configuredFrontendUrl = process.env.FRONTEND_URL?.trim() ?? 'http://localhost:3000';
const configuredFrontendUrls = (process.env.FRONTEND_URLS ?? '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

export default () => ({
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: configuredFrontendUrl,
  allowedFrontendUrls: Array.from(new Set([configuredFrontendUrl, ...configuredFrontendUrls])),
  database: {
    url: configuredDatabaseUrl
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-this-secret-before-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:4000/api/auth/google/callback'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? '',
    successUrl: process.env.STRIPE_SUCCESS_URL ?? 'http://localhost:3000/account?payment=success',
    cancelUrl: process.env.STRIPE_CANCEL_URL ?? 'http://localhost:3000/checkout'
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? ''
  }
});