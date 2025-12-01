@echo off
REM --- Navigate to your GitHub repo folder ---
cd /d "C:\Users\aden_\Desktop\Stream\TCGBinder\binder"

REM --- Stage only the sets folder ---
git add sets/*

REM --- Commit with timestamp ---
for /f "tokens=1-4 delims=/: " %%a in ("%date% %time%") do set timestamp=%%a-%%b-%%c_%%d
git commit -m "Update binder files %timestamp%"

REM --- Push to GitHub ---
git push origin main

echo Done!
pause