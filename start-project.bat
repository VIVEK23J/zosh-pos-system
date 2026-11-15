@echo off
echo Starting ZOSH POS System...

echo Starting Spring Boot Backend on port 5000...
start "ZOSH POS Backend" cmd /k "cd /d "%~dp0zosh-pos-system" && mvnw.cmd spring-boot:run"

echo Starting Vite React Frontend on port 5173...
start "ZOSH POS Frontend" cmd /k "cd /d "%~dp0zosh-frontend-pos-system\zosh-pos-frontend" && npm run dev"

echo Both services launched in separate windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
pause
