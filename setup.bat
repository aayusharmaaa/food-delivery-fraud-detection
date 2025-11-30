@echo off
echo Installing Backend Dependencies...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo Installing Frontend Dependencies...
cd frontend
npm install
cd ..

echo Setup Complete! You can now run start_servers.bat
pause
