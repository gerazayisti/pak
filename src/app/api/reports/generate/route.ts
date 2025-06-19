import { NextResponse } from 'next/server';
import { generateWordReport } from '@/lib/report-generator';
import { Quarter } from '@/types/kpi';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, quarter } = body;

    if (!year || !quarter) {
      return NextResponse.json(
        { error: 'Année et trimestre requis' },
        { status: 400 }
      );
    }

    if (!['T1', 'T2', 'T3', 'T4'].includes(quarter)) {
      return NextResponse.json(
        { error: 'Trimestre invalide' },
        { status: 400 }
      );
    }

    try {
      const report = await generateWordReport(year, quarter as Quarter);
      return NextResponse.json(report);
    } catch (error) {
      console.error('Erreur lors de la génération du document Word:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la génération du document Word' },
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