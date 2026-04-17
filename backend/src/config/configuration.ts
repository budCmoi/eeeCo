const configuredMongoUri = process.env.MONGODB_URI?.trim() ?? '';

export default () => ({
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  database: {
    uri: configuredMongoUri,
    useInMemory: process.env.USE_IN_MEMORY_DB === 'true' || configuredMongoUri.length === 0
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