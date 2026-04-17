# EEECO

Premium fashion e-commerce monorepo built with Next.js, Tailwind CSS, GSAP, Lenis, Framer Motion, Zustand, NestJS, MongoDB, Stripe, and Google OAuth.

## What is included

- Immersive homepage with Lenis smooth scrolling, GSAP ScrollTrigger reveals, subtle parallax, sticky storytelling, and editorial motion.
- Fully responsive storefront pages: home, shop, product detail, cart, checkout, account, and protected admin route.
- Frontend architecture split into components, animations, store, services, data, and typed models.
- NestJS REST API with products, users, orders, payments, uploads, validation, JWT auth, Google OAuth, role guards, and rate limiting.
- Demo fallbacks so the UI remains usable before MongoDB, Stripe, Cloudinary, and Google credentials are connected.

## Project structure

```text
frontend/
  animations/
  components/
  data/
  lib/
  pages/
  services/
  store/
  styles/
  types/

backend/
  src/
    auth/
    common/
    config/
    orders/
    payments/
    products/
    uploads/
    users/
```

## Routes

- /
- /shop
- /product/:id
- /cart
- /checkout
- /account
- /admin-secret

## Local development

1. Copy frontend/.env.local.example to frontend/.env.local.
2. Copy backend/.env.example to backend/.env.
3. Install dependencies from the monorepo root.
4. Run the frontend and backend together.

```bash
npm install
npm run dev
```

Frontend runs on http://localhost:3000.
Backend runs on http://localhost:4000.

## Build

```bash
npm run build
```

## Environment wiring

### Frontend

- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_FRONTEND_URL
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

### Backend

- PORT
- FRONTEND_URL
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL
- STRIPE_SECRET_KEY
- STRIPE_SUCCESS_URL
- STRIPE_CANCEL_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## Notes

- Product browsing falls back to local mock data when the API is unavailable.
- Checkout falls back to a demo success redirect when Stripe keys are missing.
- The account page exposes demo client/admin sign-in buttons so protected flows can be verified locally before Google OAuth is configured.
- For production, move token persistence to a hardened server-managed session or HttpOnly cookie flow.