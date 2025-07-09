import { Quarter } from '@/types/kpi';
import { generateKPIReport } from './kpi-utils';
import { initialKPIData } from '@/data/kpi-data';
import { formatKPICategory } from './kpi-utils';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateWordReport(months: string[], prompt?: string, n8nData?: any) {
  try {
    // Créer un nouveau document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `Rapport KPI`,
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Mois sélectionnés : ${months.join(', ')}`,
            spacing: { after: 200 },
          }),
          prompt ? new Paragraph({ text: `Prompt : ${prompt}`, spacing: { after: 200 } }) : undefined,
          n8nData ? new Paragraph({ text: 'Données dynamiques de n8n :', heading: 'Heading2', spacing: { after: 100 } }) : undefined,
          ...(n8nData ? Object.entries(n8nData).map(([key, value]) => new Paragraph({ text: `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}` })) : []),
        ].filter(Boolean),
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    const base64 = buffer.toString('base64');
    return {
      title: `Rapport_${months.join('_')}`,
      date: new Date().toLocaleDateString('fr-FR'),
      content: base64,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error('Erreur lors de la génération du rapport Word');
  }
}

export async function generatePDFReport(months: string[], prompt?: string, n8nData?: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = height - 60;
  page.drawText('Rapport KPI', { x: 50, y, size: 24, font, color: rgb(0,0,0) });
  y -= 40;
  page.drawText('Mois sélectionnés :', { x: 50, y, size: 16, font });
  y -= 24;
  months.forEach((month) => {
    page.drawText('- ' + month, { x: 70, y, size: 14, font });
    y -= 20;
  });
  if (prompt) {
    y -= 20;
    page.drawText('Prompt :', { x: 50, y, size: 16, font });
    y -= 20;
    page.drawText(prompt, { x: 70, y, size: 12, font });
  }
  if (n8nData) {
    y -= 30;
    page.drawText('Données dynamiques de n8n :', { x: 50, y, size: 16, font });
    y -= 20;
    Object.entries(n8nData).forEach(([key, value]) => {
      page.drawText(`${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`, { x: 70, y, size: 12, font });
      y -= 16;
    });
  }
  const pdfBytes = await pdfDoc.save();
  const base64 = Buffer.from(pdfBytes).toString('base64');
  return {
    title: `Rapport_KPI_${months.join('_')}`,
    date: new Date().toLocaleDateString('fr-FR'),
    content: base64,
    mimeType: 'application/pdf',
  };
} 