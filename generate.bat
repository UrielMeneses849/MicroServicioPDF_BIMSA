@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ===============================
echo BIMSA PDF GENERATOR
echo ===============================

REM Recibir parametro
set claves=%1

IF "%claves%"=="" (
    echo ❌ No se enviaron claves
    exit /b 1
)

echo Claves recibidas: %claves%

REM Construir JSON dinámico
set json={"obras":[

for %%a in (%claves%) do (
    set json=!json!"%%a",
)

set json=!json:~0,-1!]}
echo JSON: !json!

REM Levantar docker
docker compose up -d

REM Esperar a que el server esté listo
timeout /t 5 >nul

REM Llamar API
curl -X POST http://localhost:3000/generate ^
-H "Content-Type: application/json" ^
-d "!json!"

echo ===============================
echo PDFs generados en /output
echo ===============================

ENDLOCAL