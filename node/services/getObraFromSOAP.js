const axios = require('axios');

async function getObraXML(clave) {

  const url = 'https://construleads.com/ws_cl_pruebas/ws_cl.asmx/ws_CL_sobrasfull';

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        sClave_obras: clave,
        sTk: ''
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log("📥 RESPONSE DIRECTO:\n", response.data.slice(0, 500));

    return response.data;

  } catch (error) {
    console.log("❌ ERROR HTTP DIRECTO");

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("HEADERS:", error.response.headers);
      console.log("BODY:", error.response.data);
    } else {
      console.log(error.message);
    }

    throw error;
  }
}

function extractXML(soapResponse) {
  // Caso 1: XML viene normal
  let match = soapResponse.match(/<ROOT>[\s\S]*<\/ROOT>/);
  if (match) return match[0];

  // Caso 2: XML viene escapado (&lt;ROOT&gt;)
  const escapedMatch = soapResponse.match(/&lt;ROOT&gt;[\s\S]*&lt;\/ROOT&gt;/);

  if (escapedMatch) {
    let decoded = escapedMatch[0]
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

    return decoded;
  }

  // Caso 3: sin datos
  if (soapResponse.includes('sin datos')) {
    console.log('⚠️ SOAP respondió sin datos reales');
    return null;
  }

  console.log('⚠️ No se pudo extraer ROOT del SOAP');
  return null;
}

module.exports = {
  getObraXML,
  extractXML
};