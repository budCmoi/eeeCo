# EEECO — Marketplace Premium Mode & Lifestyle

> Une plateforme e-commerce complète pensée pour démontrer des compétences techniques avancées et produire un produit startup prêt pour la production.

---

## 🎯 Présentation du projet

**EEECO** est une marketplace de mode et lifestyle permettant à des particuliers et vendeurs professionnels d'acheter et vendre des vêtements, chaussures et accessoires. Conçu avec une architecture scalable et un design minimaliste de niveau Awwwards, ce projet illustre la maîtrise d'un stack technique moderne de bout en bout.

---

## ✨ Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| 🏠 Page d'accueil | Produits dynamiques, catégories, hero animé GSAP |
| 🔍 Recherche avancée | Recherche en temps réel, filtres prix/délai/catégorie |
| 📦 Fiche produit | Galerie images, infos vendeur, suggestions, contact |
| 🛒 Panier | Gestion produits, calcul dynamique, checkout Stripe |
| 💬 Messagerie | Conversations acheteur↔vendeur, historique complet |
| 👤 Profil utilisateur | Infos, commandes, discussions, statut vendeur |
| 🏪 Vente | Formulaire création produit, upload images, publication |
| 🤖 Chatbot | Assistant intégré avec FAQ contextuelle |
| 🔐 Auth complète | Email/password + Google OAuth2, JWT sécurisé |
| 📊 Analytics | Google Analytics 4, tracking events |
| 📱 Responsive | Mobile, tablette et desktop |

---

## ⚙️ Stack technique

### Frontend
| Technologie | Usage |
|---|---|
| **Next.js 15** | Framework React, SSR/SSG, routing |
| **TypeScript** | Typage strict end-to-end |
| **Tailwind CSS** | Styling utility-first, thème custom |
| **Framer Motion** | Animations UI fluides |
| **GSAP + ScrollTrigger** | Animations scroll avancées |
| **Zustand** | State management (panier, auth) |
| **Axios** | Client HTTP avec intercepteurs |
| **Lenis** | Smooth scroll haute performance |

### Backend
| Technologie | Usage |
|---|---|
| **NestJS 10** | Framework Node.js modulaire |
| **TypeScript** | Architecture typée |
| **Prisma 6** | ORM avec migrations et seed |
| **PostgreSQL** | Base de données relationnelle |
| **JWT + Passport** | Authentification sécurisée |
| **bcrypt** | Hachage des mots de passe |
| **Cloudinary** | Stockage et optimisation images |
| **Stripe** | Paiements sécurisés |
| **@nestjs/throttler** | Rate limiting global |

---

## 🗃️ Architecture base de données (Prisma)

```
User ──────────────── Order
 │                      │
 │                      └── OrderItem ──── Product
 │                                           │
 ├── Product (en tant que vendeur)           └── ProductImage
 │     └── Category
 │
 └── Conversation (via ConversationParticipant)
       └── Message
```

### Modèles Prisma

| Modèle | Description |
|---|---|
| `User` | Profil, auth (local + Google), rôle, isSeller |
| `Product` | Listing complet avec images, catégorie, vendeur |
| `ProductImage` | Images séparées avec position ordonnée |
| `Category` | Catégories produits avec slug |
| `Order` | Commande avec items structurés et adresse |
| `OrderItem` | Ligne de commande liée à un produit réel |
| `Conversation` | Thread de messages entre 2 utilisateurs |
| `ConversationParticipant` | Table pivot User↔Conversation |
| `Message` | Message individuel avec statut lu/non-lu |

---

## 📁 Structure du projet

```
eeeCo/
├── backend/               # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma  # Schéma complet (9 modèles)
│   │   └── migrations/    # Migrations versionnées
│   └── src/
│       ├── auth/          # JWT, Google OAuth, login local + register
│       ├── categories/    # Gestion catégories (seeded)
│       ├── messages/      # Messagerie (conversations + messages)
│       ├── orders/        # Commandes
│       ├── payments/      # Stripe checkout
│       ├── products/      # CRUD produits avec filtres avancés
│       ├── uploads/       # Upload Cloudinary
│       └── users/         # Profils utilisateurs
│
└── frontend/              # App Next.js
    ├── components/
    │   ├── layout/        # Header, Footer, Shell
    │   ├── shop/          # ProductCard, Gallery
    │   └── ui/            # Button, Chatbot, Reveal...
    ├── pages/
    │   ├── index.tsx      # Accueil dynamique avec catégories
    │   ├── shop.tsx       # Recherche + filtres avancés
    │   ├── product/       # Fiche produit complète
    │   ├── messages.tsx   # Messagerie en temps réel
    │   ├── sell.tsx       # Formulaire de vente
    │   ├── account.tsx    # Profil utilisateur
    │   └── checkout.tsx   # Checkout Stripe
    ├── services/          # Appels API typés
    ├── store/             # Zustand (auth, panier)
    └── types/             # Types TypeScript partagés
```

---

## 🚀 Installation & lancement

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Compte Cloudinary (images)
- Compte Stripe (paiements)

### 1. Cloner le repo
```bash
git clone https://github.com/votre-user/eeeco.git
cd eeeco
npm install
```

### 2. Configuration backend
```bash
cp backend/.env.example backend/.env
```

Variables requises dans `backend/.env` :
```env
DATABASE_URL=postgresql://user:password@localhost:5432/eeeco
JWT_SECRET=votre-secret-jwt-securise-minimum-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
```

### 3. Configuration frontend
```bash
cp frontend/.env.local.example frontend/.env.local
```

Variables dans `frontend/.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Migrations base de données
```bash
cd backend
npm run db:migrate:dev -- --name init
```

### 5. Lancer en développement
```bash
# Depuis la racine du monorepo
npm run dev
```

- Frontend : http://localhost:3000
- Backend : http://localhost:4000

---

## 🔐 Sécurité

- **JWT** : tokens signés, expiration configurée
- **bcrypt** cost 12 : hachage des mots de passe
- **Rate limiting** : 100 req/min via `@nestjs/throttler`
- **Validation stricte** : `class-validator` sur tous les DTOs
- **CORS** : whitelist des origines autorisées uniquement
- **Sanitisation** : données nettoyées avant persistence

---

## 📊 Performance

- **Lazy loading** images avec `next/image`
- **Code splitting** automatique par route Next.js
- **Lenis** smooth scroll 60fps
- **GSAP ScrollTrigger** optimisé avec `will-change`
- **Optimistic UI** sur le panier

---

## 🌐 Déploiement

| Environnement | Frontend | Backend |
|---|---|---|
| Dev | localhost:3000 | localhost:4000 |
| Production | Vercel | Render / Railway |

```bash
# Build production
npm run build
```

---

## 🎨 Design

Palette : **Noir** (#0a0a0a) + **Blanc** (#f5f5f0) + **Vert** (#2d5a27) + **Marron** (#7a5c3f)

Style minimaliste inspiré Awwwards avec :
- Typographie petite, espacements généreux
- Boutons avec border-radius arrondi (rounded-full)
- Animations fluides Framer Motion
- Grain texture subtil en overlay

---

## 📸 Screenshots

> *Captures à ajouter dans `/docs/screenshots/`*

| Page | Description |
|---|---|
| `hero.png` | Page d'accueil avec hero animé |
| `shop.png` | Boutique avec filtres avancés |
| `product.png` | Fiche produit complète |
| `messages.png` | Interface de messagerie |
| `sell.png` | Formulaire de vente |

---

## 🧠 Choix techniques

**NestJS** → Architecture modulaire et typée qui favorise la séparation des responsabilités. Idéal pour des APIs REST maintenables à grande échelle.

**Prisma** → ORM moderne avec typage automatique, migrations versionnées et une DX supérieure. Évite les erreurs runtime sur les requêtes SQL.

**Next.js** → SSR natif pour le SEO, routing file-based, optimisation images intégrée et déploiement Vercel optimisé.

**Zustand** → State management ultra-léger (< 1kb) sans boilerplate, parfait pour le panier et l'auth client.

**GSAP + Lenis** → Combo performant pour des animations scroll à 60fps stables sur tous navigateurs.

---

## 📋 Routes disponibles

| Route | Description |
|---|---|
| `/` | Page d'accueil dynamique |
| `/shop` | Boutique avec recherche + filtres |
| `/product/:slug` | Fiche produit |
| `/cart` | Panier |
| `/checkout` | Paiement Stripe |
| `/account` | Profil utilisateur |
| `/messages` | Messagerie |
| `/sell` | Publier un article |
| `/admin-secret` | Interface admin |

---

## 👨‍💻 Auteur

Projet conçu et développé — disponible pour opportunités techniques.
