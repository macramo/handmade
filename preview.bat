@echo off
cd /d "%~dp0"
echo.
echo  MACR_AMO_  preview local
echo  http://127.0.0.1:4173
echo.
node tools\preview-server.js
