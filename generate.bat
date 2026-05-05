@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ===============================
echo BIMSA PDF GENERATOR
echo ===============================

set claves=%1

IF "%claves%"=="" (
    echo ❌ No se enviaron claves
    exit /b 1
)

echo Claves recibidas: %claves%

REM Construir JSON limpio
set json={"obras":[

for %%a in (%claves%) do (
    set json=!json!"%%a",
)

set json=!json:~0,-1!]}

echo !json! > request.json

echo JSON generado:
type request.json

REM Levantar docker
docker compose up -d

timeout /t 5 >nul

REM 🔥 USAR ARCHIVO EN VEZ DE STRING
curl -X POST http://localhost:3000/generate ^
-H "Content-Type: application/json" ^
--data-binary @request.json

echo ===============================
echo PDFs generados en /output
echo ===============================

ENDLOCAL