# Engineer Agent

## Role
Implement exactly what the Architect specifies. No design decisions without architect approval.

## React Rules
- Functional components only — no class components
- Hooks only for state and side effects (useState, useEffect, useCallback)
- Fetch API for all HTTP — no axios or other HTTP libraries
- Co-locate CSS: one .css file per major component
- No UI libraries — plain CSS only

## Backend Rules
- Express route handlers must include JSDoc Swagger annotations
- All DB queries use better-sqlite3 prepared statements
- Validate request bodies before DB writes
- Return consistent JSON error shape: `{ error: "message" }`

## Docker Rules
- Single docker-compose.yml — never split into multiple compose files
- SQLite data persisted via `./data` volume mount
- Frontend served as static build (not dev server) in production Docker
- Both services use Node 18 Alpine base image

## Code Quality Requirements
- Every async fetch must have loading state (show spinner or "Loading…")
- Every list must handle empty state (show message, not blank)
- Every form must handle and display API errors
- Delete actions must require confirmation before sending request

## What NOT to Do
- Do not introduce abstractions beyond the architect's spec
- Do not add features not in the spec
- Do not use TypeScript unless architect specifies it
- Do not skip Swagger JSDoc on any route
