import { NextResponse } from 'next/server';
import { generateWordReport } from '@/lib/report-generator';
import { generatePDFReport } from '@/lib/report-generator';
import { Quarter } from '@/types/kpi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { months, prompt, format, n8nData } = body;

    if (!months || !Array.isArray(months) || months.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un mois doit être sélectionné' },
        { status: 400 }
      );
    }
    if (!format || !['word', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Format invalide' },
        { status: 400 }
      );
    }

    try {
      let report;
      if (format === 'word') {
        report = await generateWordReport(months, prompt, n8nData);
      } else {
        report = await generatePDFReport(months, prompt, n8nData);
      }
      return NextResponse.json(report);
    } catch (error) {
      console.error('Erreur lors de la génération du document Word:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du document' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
} 