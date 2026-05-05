const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function mergePDFs(files, outputPath) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const pdfBytes = fs.readFileSync(file);
    const pdf = await PDFDocument.load(pdfBytes);

    const pages = await mergedPdf.copyPages(
      pdf,
      pdf.getPageIndices()
    );

    pages.forEach(page => mergedPdf.addPage(page));
  }

  const finalPdf = await mergedPdf.save();
  fs.writeFileSync(outputPath, finalPdf);

  return outputPath;
}

module.exports = mergePDFs;