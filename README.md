# GymFlow Backend Prototype

This lightweight backend provides a simple REST API for the GymFlow frontend prototype (index.html). It uses a JSON file (`data.json`) as a simple datastore, and Express for the API.

Getting started

1. Install Node.js (14+ recommended)
2. From the workspace root (where `index.html` is), run:

```bash
npm install
npm run start
```

3. Open http://localhost:3000 in your browser to use the frontend and the backend.

Provided endpoints (simple examples):
- GET /api/members — returns all members
- POST /api/members — create a new member (JSON body)
- PUT /api/members/:id — update a member
- DELETE /api/members/:id — delete a member by id or name
- GET /api/dashboard-stats — returns a small summary object
- GET /api/classes — list classes
- POST /api/classes — add a class
- GET /api/staff — list staff
- POST /api/staff — add staff

Notes
- The backend uses `data.json` for storage and persists changes to it. It is not a production-ready storage.
- The backend serves the static frontend files from the root; you can use the same server for development.
