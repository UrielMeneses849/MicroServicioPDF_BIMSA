const express = require('express');
const { generarPDFs } = require('./orquestador'); // lo crearemos
const app = express();

app.use(express.json());

const PORT = 3000;

// 🎯 ENDPOINT PRINCIPAL
app.post('/generate', async (req, res) => {
  try {
    const { obras } = req.body;

    if (!obras || !Array.isArray(obras) || obras.length === 0) {
      return res.status(400).json({ error: 'Debes enviar un arreglo de obras' });
    }

    console.log('📥 Obras recibidas:', obras);

    const result = await generarPDFs(obras);

    // 🟢 UNA OBRA
    if (obras.length === 1) {
      return res.download(result.files[0]);
    }

    // 🔵 VARIAS OBRAS
    return res.download(result.finalPath);

  } catch (error) {
    console.error('🔥 ERROR:', error);
    res.status(500).json({ error: 'Error generando PDFs' });
  }
});

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servicio corriendo en http://localhost:${PORT}`);
});