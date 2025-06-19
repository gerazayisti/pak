import { Quarter } from '@/types/kpi';
import { generateKPIReport } from './kpi-utils';
import { initialKPIData } from '@/data/kpi-data';
import { formatKPICategory } from './kpi-utils';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';

export async function generateWordReport(year: number, quarter: Quarter) {
  try {
    const report = generateKPIReport(initialKPIData, year, quarter);

    // Créer un nouveau document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Titre du document
          new Paragraph({
            text: `Rapport KPI - ${quarter} ${year}`,
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),

          // Date de génération
          new Paragraph({
            text: `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
            alignment: AlignmentType.RIGHT,
            spacing: {
              after: 400,
            },
          }),

          // Résumé global
          new Paragraph({
            text: 'Résumé Global',
            heading: 'Heading2',
            spacing: {
              after: 200,
            },
          }),

          // Tableau du résumé global
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Total KPI')],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph(report.overallStatus.total.toString())],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Dans la Tendance')],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph(report.overallStatus.completed.toString())],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('En Cours')],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph(report.overallStatus.inProgress.toString())],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('À Rattraper')],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph(report.overallStatus.delayed.toString())],
                    width: { size: 25, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
            ],
          }),

          // Détails par catégorie
          new Paragraph({
            text: 'Détails par Catégorie',
            heading: 'Heading2',
            spacing: {
              before: 400,
              after: 200,
            },
          }),

          // Tableau des catégories
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              // En-tête
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Catégorie')],
                    width: { size: 30, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Total')],
                    width: { size: 17.5, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('Dans la Tendance')],
                    width: { size: 17.5, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('En Cours')],
                    width: { size: 17.5, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph('À Rattraper')],
                    width: { size: 17.5, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Données des catégories
              ...report.categories.map(category => 
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(formatKPICategory(category.category))],
                    }),
                    new TableCell({
                      children: [new Paragraph(category.totalKPIs.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(category.completedKPIs.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(category.inProgressKPIs.toString())],
                    }),
                    new TableCell({
                      children: [new Paragraph(category.delayedKPIs.toString())],
                    }),
                  ],
                })
              ),
            ],
          }),
        ],
      }],
    });

    // Générer le document en buffer
    const buffer = await Packer.toBuffer(doc);

    // Convertir le buffer en base64
    const base64 = buffer.toString('base64');

    return {
      title: `Rapport KPI - ${quarter} ${year}`,
      date: new Date().toLocaleDateString('fr-FR'),
      content: base64,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    throw new Error('Erreur lors de la génération du rapport Word');
  }
} 