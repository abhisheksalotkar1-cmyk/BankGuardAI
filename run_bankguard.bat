@echo off
title BankGuard AI Platform Launcher
color 0B

echo =====================================================================
echo        BankGuard AI - Intelligent Customer Retention Platform
echo        Author: Abhishek Salotkar (abhisheksalotkar1-cmyk)
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python & Node dependencies...
set PYTHONPATH=%cd%\backend

echo [2/3] Launching FastAPI Backend on http://127.0.0.1:8000...
start "BankGuard AI Backend API" cmd /k "title BankGuard AI Backend && cd backend && py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [3/3] Launching React Vite Frontend on http://localhost:5173...
start "BankGuard AI Frontend" cmd /k "title BankGuard AI Frontend && cd frontend && npm run dev"

echo.
echo =====================================================================
echo   BankGuard AI Platform is starting!
echo.
echo   * Backend API:       http://127.0.0.1:8000
echo   * API Documentation: http://127.0.0.1:8000/docs
echo   * Web Dashboard:     http://localhost:5173
echo.
echo   Keep the terminal windows open while using the platform.
echo =====================================================================
echo.
pause
