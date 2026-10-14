# Urban Spice Restaurant — MERN Stack

A full-stack restaurant application rebuilt as a genuine **MongoDB + Express.js + React.js + Node.js (MERN)** app, preserving the original Urban Spice UI, menu, cart, checkout, reservations, and admin dashboard.

---

## 1. Final project structure

```
urban-spice-restaurant/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Header, Footer, DishCard, Field, ProtectedRoute, etc.
│   │   ├── pages/                # Home, MenuPage, ReservationsPage, AdminPage, etc.
│   │   ├── layouts/              # MainLayout (header + outlet + footer)
│   │   ├── context/              # AuthContext, CartContext
│   │   ├── hooks/                # useFetch / useMutation
│   │   ├── services/             # api.js + one service file per resource
│   │   ├── utils/                # formatting helpers
│   │   ├── styles/                # plain CSS design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Express + MongoDB backend
│   ├── controllers/              # auth, menu, order, reservation, contact, admin
│   ├── models/                   # User, MenuItem, Order, Reservation, ContactMessage, Newsletter
│   ├── routes/                   # one router per resource
│   ├── middleware/               # auth (JWT + role check), error handler
│   ├── config/                   # db.js (Mongoose connection)
│   ├── utils/                    # generateToken.js
│   ├── seed/                     # seed.js
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 2. Installation

```bash
# from the project root
cd server && npm install
cd ../client && npm install
```

---

## 3. Environment variables

Copy the example file and fill in real values:

```bash
cp .env.example server/.env
```

`server/.env` should contain:

```
MONGO_URI=mongodb://localhost:27017/urban-spice
JWT_SECRET=replace-this-with-a-long-random-string
PORT=5000
CLIENT_URL=http://localhost:5173
ADMIN_PASSWORD=Admin@12345
```

- `MONGO_URI` — connection string for a local MongoDB instance or a MongoDB Atlas cluster.
- `JWT_SECRET` — any long, random string used to sign JWTs.
- `ADMIN_PASSWORD` — used only by the seed script when creating the demo admin account.

The client reads `VITE_API_URL` (optional, defaults to `http://localhost:5000/api`). If you need to change it, create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## 4. MongoDB setup

**Option A — local MongoDB**
Install MongoDB Community Server and run it, then use:
```
MONGO_URI=mongodb://localhost:27017/urban-spice
```

**Option B — MongoDB Atlas (cloud, no local install needed)**
1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a database user and allow your IP address
3. Copy the provided connection string into `MONGO_URI`, e.g.
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/urban-spice
```

---

## 5. Seed the database

This creates 16 menu items, 1 admin account, 3 sample users, sample orders, and sample reservations.

```bash
cd server
npm run seed
```

---

## 6. Run the app

**Backend** (from `server/`):
```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```
Runs on `http://localhost:5000`.

**Frontend** (from `client/`):
```bash
npm run dev
```
Runs on `http://localhost:5173`.

---

## 7. Demo admin credentials

```
Email:    admin@urbanspice.test
Password: Admin@12345   (or whatever you set as ADMIN_PASSWORD before seeding)
```

A regular sample user is also created:
```
Email:    aarav@example.com
Password: Password@123
```

---

## 8. How the pieces talk to each other

**React → Express**
The frontend never touches MongoDB directly. Every page calls a function in `client/src/services/*.js`, which uses the shared Axios instance in `client/src/services/api.js`. That instance automatically attaches the JWT (from `localStorage`) to the `Authorization` header of every request, and points at `VITE_API_URL` (default `http://localhost:5000/api`).

**Express → MongoDB**
`server/server.js` calls `connectDB()` (in `server/config/db.js`), which uses **Mongoose** to open a single connection to MongoDB using `MONGO_URI`. Each resource has a Mongoose model (`server/models/*.js`) that defines its schema and validation. Controllers (`server/controllers/*.js`) use these models to read and write data; routes (`server/routes/*.js`) wire URLs to controllers and attach middleware (`protect` for authenticated routes, `adminOnly` for admin-only routes).

**Authentication**
Passwords are hashed with `bcryptjs` before being saved (`User` model's `pre("save")` hook) and are never returned in API responses (`select: false` on the schema field). On login/register, the server signs a JWT with `jsonwebtoken` containing the user's ID. The `protect` middleware verifies that token on every protected request and loads the corresponding user; `adminOnly` then checks `req.user.role === "admin"`.

---

## 9. REST API endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Menu
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/menu` | Public |
| GET | `/api/menu/:id` | Public |
| POST | `/api/menu` | Admin |
| PUT | `/api/menu/:id` | Admin |
| DELETE | `/api/menu/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/orders` | Private (own orders, or all for admin) |
| GET | `/api/orders/:id` | Private (owner or admin) |
| POST | `/api/orders` | Private |
| PUT | `/api/orders/:id/status` | Admin |
| DELETE | `/api/orders/:id` | Admin |

### Reservations
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/reservations` | Private (own, or all for admin) |
| POST | `/api/reservations` | Private |
| PUT | `/api/reservations/:id` | Private (owner or admin) |
| DELETE | `/api/reservations/:id` | Private (owner or admin) |

### Contact & Newsletter
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/contact` | Public |
| POST | `/api/newsletter` | Public |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/summary` | Admin |
| GET | `/api/admin/users` | Admin |

### Health
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |

---

## 10. Notes on the conversion

- The original project (Replit-generated) used an **in-memory JavaScript array** as its "database" and TypeScript throughout. Both have been fully removed.
- All data (users, menu, orders, reservations, contact messages, newsletter subscribers) is now persisted in **MongoDB via Mongoose**.
- The cart remains **client-side** (React Context + `localStorage`), as specified — only finalized orders are written to MongoDB.
- The UI, color palette, typography, page structure, and copy from the original Urban Spice design were preserved and re-implemented in plain CSS (no Tailwind, no TypeScript).
