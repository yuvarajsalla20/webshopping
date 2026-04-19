# Shopping MVP — CLAUDE.md

## Project Overview
Full-stack e-commerce MVP with customer browsing/cart/checkout and admin product management.

## Tech Stack
- **Frontend**: React 18, React Router v6, plain CSS
- **Backend**: Node.js + Express
- **Database**: SQLite via better-sqlite3
- **API Docs**: Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Container**: Docker + docker-compose

## Access Points
| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:5000        |
| Swagger   | http://localhost:5000/api-docs |

## Folder Structure
```
shopping/
├── CLAUDE.md
├── docker-compose.yml
├── README.md
├── .gitignore
├── .env.example
├── .claude/agents/
│   ├── architect.md
│   └── engineer.md
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       └── components/
│           ├── Header.jsx
│           ├── ProductGrid.jsx
│           ├── ProductCard.jsx
│           ├── Cart.jsx
│           ├── CartItem.jsx
│           └── admin/
│               ├── AdminPanel.jsx
│               └── ProductForm.jsx
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── server.js
        ├── database.js
        ├── swagger.js
        └── routes/
            ├── products.js
            ├── cart.js
            └── orders.js
```

## Agent Collaboration Rules
- **Architect** designs DB schema, API contracts, component tree, state design — no implementation code
- **Engineer** implements exactly what architect specifies — no design decisions without architect approval
- All API changes must be reflected in Swagger docs
- Schema changes must update database.js seed logic

## Coding Conventions
- Functional React components only, hooks-based state
- Fetch API for HTTP calls (no axios)
- CSS co-located with components or in App.css
- No UI libraries — plain CSS only
- Express routes use JSDoc for Swagger generation
- SQLite queries use prepared statements (better-sqlite3 sync API)

## Running the App
```bash
# Single command — starts frontend + backend + DB
docker-compose up

# Local dev (without Docker)
cd backend && npm install && npm start
cd frontend && npm install && npm start
```
