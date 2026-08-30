# SkillSync

SkillSync is a full-stack collaboration platform for coding practice, live sessions, chat, and video calls.

## Project structure

```text
SkillSync/
├── backend/                    # Express API and server-side integrations
│   ├── src/
│   │   ├── config/             # Application configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose data models
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Reusable business logic
│   │   ├── lib/                # Database and third-party clients
│   │   └── server.js           # Server entry point
│   ├── tests/                  # Backend tests
│   ├── .env                    # Local secrets (not committed)
│   └── package.json
├── frontend/                   # React + Vite web application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # API request modules
│   │   ├── assets/             # Imported images and fonts
│   │   ├── components/         # Reusable UI components
│   │   ├── data/               # Static application data
│   │   ├── hooks/              # Reusable React hooks
│   │   ├── layouts/            # Shared page layouts
│   │   ├── lib/                # Client and utility integrations
│   │   ├── pages/              # Route-level page components
│   │   ├── styles/             # Shared style files
│   │   ├── App.jsx             # Application routes
│   │   └── main.jsx            # Client entry point
│   ├── tests/                  # Frontend tests
│   ├── .env                    # Local client configuration (not committed)
│   └── package.json
├── docs/                       # Architecture and API documentation
├── package.json                # Workspace-level scripts
└── .gitignore
```

## Run locally

Install dependencies and start each app in a separate terminal:

```bash
npm install --prefix backend
npm install --prefix frontend
npm run dev --prefix backend
npm run dev --prefix frontend
```

Create the required environment variables in `backend/.env` and `frontend/.env` before starting the apps.
