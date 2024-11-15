# Towpath Community

A Community-driven canal navigation. Navigate and connect on the Cut with ease.

## Project Structure
```
towpath/
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── api/        # API routes
│   │   ├── models/     # Database models
│   │   └── schemas/    # Pydantic schemas
│   └── migrations/     # Alembic migrations
└── frontend/           # React frontend
    └── src/
        ├── components/ # React components
        └── pages/      # Page components
```

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```bash
# Create database
psql postgres -c "CREATE DATABASE towpath_db;"

# Run migrations
cd backend
alembic upgrade head
```

## Current Features
- User authentication (JWT)
- Protected routes
- Login/Register pages