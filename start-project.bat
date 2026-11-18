@echo off
echo Starting ZOSH POS System...

if not defined JAVA_HOME (
    if exist "C:\Program Files\Java\jdk-21.0.12.1" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1"
    ) else if exist "C:\Program Files\Java\latest" (
        set "JAVA_HOME=C:\Program Files\Java\latest"
    )
)

echo Starting Spring Boot Backend on port 5000...
start "ZOSH POS Backend" cmd /k "cd /d "%~dp0zosh-pos-system" && set "JAVA_HOME=%JAVA_HOME%" && mvnw.cmd spring-boot:run"

echo Starting Vite React Frontend on port 5173...
start "ZOSH POS Frontend" cmd /k "cd /d "%~dp0zosh-frontend-pos-system\zosh-pos-frontend" && npm run dev"

echo Both services launched in separate windows.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
pause
