<?php


// 🔥 Leer XML del body
$xmlRaw = file_get_contents('php://input');

if (!$xmlRaw) {
    http_response_code(400);
    echo "No llegó XML";
    exit;
}

// 🔥 Parsear XML
$xml = simplexml_load_string($xmlRaw);

if (!$xml) {
    http_response_code(400);
    echo "XML inválido";
    exit;
}

// 🔥 Obtener datos
$data = $xml->OBRAS;

// 🔥 Aquí puedes reutilizar tu lógica existente
// (si ya construías $obra en ficha-obra.php, pásalo)

// 👉 ejemplo simple:
$obra = $data;

// 🔥 Renderizar HTML
ob_start();
include __DIR__ . '/../ficha-obra.php';
$html = ob_get_clean();

// 🔥 Responder HTML
echo $html;