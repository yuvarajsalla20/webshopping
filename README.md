# ShopMVP — Online Shopping Application

A full-stack e-commerce MVP with product browsing, cart, checkout, and admin product management.

## Tech Stack
- **Frontend**: React 18, React Router v6, plain CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **API Docs**: Swagger UI
- **Containers**: Docker + docker-compose

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Git](https://git-scm.com/)

## Run the App (single command)

```bash
docker-compose up
```

That's it. Docker builds both services and starts them.

## Access Points

| Service    | URL                            |
|------------|--------------------------------|
| Frontend   | http://localhost:3000          |
| Backend    | http://localhost:5000          |
| Swagger UI | http://localhost:5000/api-docs |

## Features

### Customer (http://localhost:3000)
- Browse products in a responsive grid
- Add to cart, adjust quantities, remove items
- Checkout — saves order to DB and clears cart

### Admin (http://localhost:3000/admin)
- View all products in a table
- Add, edit, and delete products with confirmation

## Local Development (without Docker)

```bash
# Backend
cd backend
npm install
npm start   # runs on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm start   # runs on port 3000
```

## Database
SQLite file is stored at `./data/shop.db` and is seeded with 6 sample products on first run.
The Docker volume `./data` persists the database across container restarts.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Phase 1 MVP"
git remote add origin https://github.com/yuvarajsalla20/onlineshopping.git
git branch -M main
git push -u origin main
```
