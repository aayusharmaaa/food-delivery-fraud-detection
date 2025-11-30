@echo off
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"
echo Servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
