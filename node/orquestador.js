const { getObraXML, extractXML } = require('./services/getObraFromSOAP');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const generatePDF = require('./services/generatePDF');
const mergePDFs = require('./services/mergePDFs');
const { parseStringPromise, Builder } = require('xml2js');

const baseURL = process.env.PHP_SERVICE_URL || 'http://nginx';

const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

async function generarPDFs(obras) {

  const generatedFiles = [];

  const soapResponse = await getObraXML(obras.join(','));
  const xml = extractXML(soapResponse);

  if (!xml) throw new Error('XML inválido');

  const parsed = await parseStringPromise(xml);
  let obrasList = parsed?.ROOT?.OBRAS || [];

  if (!Array.isArray(obrasList)) {
    obrasList = [obrasList];
  }

  for (const obra of obrasList) {

    const clave = obra?.proy_clave?.[0];

    if (!clave) {
      console.log('⚠️ Obra sin clave, se omite');
      continue;
    }

    const outputPath = path.join(outputDir, `ficha_${clave}.pdf`);

    // ⚡ CACHE
    if (fs.existsSync(outputPath)) {
      generatedFiles.push(outputPath);
      continue;
    }

    const builder = new Builder({ headless: true });

    const singleXML = builder.buildObject({
      ROOT: { OBRAS: obra }
    });

    console.log(`🎯 Generando HTML para obra ${clave}`);

    const phpResponse = await axios.post(`${baseURL}/api/ficha`, singleXML, {
      headers: {
        'Content-Type': 'text/xml',
        'X-XML': 'true'
      }
    });

    const html = phpResponse.data;

    if (!html || html.includes('Fatal error')) {
      throw new Error(`Error renderizando HTML para obra ${clave}`);
    }

    await generatePDF({
      html,
      outputPath
    });

    generatedFiles.push(outputPath);
  }

  // 🔥 MERGE
  if (generatedFiles.length > 1) {

    const finalPath = path.join(
      __dirname,
      'output',
      `merge_${Date.now()}.pdf`
    );

    await mergePDFs(generatedFiles, finalPath);

    return {
      files: generatedFiles,
      finalPath
    };
  }

  return {
    files: generatedFiles
  };
}

module.exports = { generarPDFs };