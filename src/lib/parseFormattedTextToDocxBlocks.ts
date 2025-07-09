import { Paragraph, HeadingLevel, Table, TableRow, TableCell, TextRun } from "docx";

export function parseFormattedTextToDocxBlocks(formattedText: string) {
  const lines = formattedText.split('\n');
  const blocks: any[] = [];
  let inTable = false;
  let tableRows: TableRow[] = [];
  let paragraphBuffer: string[] = [];

  function flushParagraph() {
    if (paragraphBuffer.length > 0) {
      blocks.push(new Paragraph({ text: paragraphBuffer.join(' '), spacing: { after: 200 } }));
      paragraphBuffer = [];
    }
  }
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0) {
        flushParagraph();
        continue;
      }
    // Séparateur
    if (line.startsWith('---')) {
      blocks.push(new Paragraph({ text: '', border: { bottom: { color: "auto", space: 1, style: "single", size: 6 } } }));
      continue;
    }

    // Titre niveau 1
    if (line.startsWith('###')) {
      blocks.push(new Paragraph({ text: line.replace('### ', ''), heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }));
      flushParagraph();
      continue;
    }

    // Titre niveau 2 (gras entre **)
    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      blocks.push(new Paragraph({ text: line.replace(/\*\*/g, ''), heading: HeadingLevel.HEADING_2, spacing: { after: 100 } }));
      flushParagraph();
      continue;
    }

    // Champ en gras
    if (line.startsWith('**')) {
      blocks.push(new Paragraph({
        children: [
          new TextRun({ text: line.replace(/\*\*/g, ''), bold: true })
        ],
        spacing: { after: 100 }
      }));
      flushParagraph();
      continue;
    }

    // Liste à puces
    if (line.startsWith('* ')) {
      blocks.push(new Paragraph({ text: line.replace('*', ''), bullet: { level: 0 } }));
      flushParagraph();
      continue;
    }

    // Liste numérotée
    if (line.match(/^\d+\.\s/)) {
      blocks.push(new Paragraph({ text: line.replace(/^\d+\.\s/, ''), numbering: { reference: "numbered-list", level: 0 } }));
      flushParagraph();
      continue;
    }

    // Tableau
    if (line.startsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1).map(cell => new TableCell({ children: [new Paragraph(cell.trim())] }));
      tableRows.push(new TableRow({ children: cells }));
      continue;
    } else if (inTable) {
      // Fin du tableau
      blocks.push(new Table({ rows: tableRows }));
      tableRows = [];
      inTable = false;
    }

    // Paragraphe normal
    if (line.length > 0) {
      blocks.push(new Paragraph({ text: line, spacing: { after: 200 } }));
      paragraphBuffer.push(line);
    }
  }
  // Si le texte se termine par un tableau
  if (inTable && tableRows.length > 0) {
    blocks.push(new Table({ rows: tableRows }));
  }
  flushParagraph();

  return blocks;
}

