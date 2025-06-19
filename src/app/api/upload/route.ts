import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été téléversé' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Format de fichier non supporté' },
        { status: 400 }
      );
    }

    // Créer un nom de fichier unique
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name}`;
    const uploadDir = join(process.cwd(), 'uploads');

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sauvegarder le fichier
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Ici, vous pouvez ajouter la logique de traitement du fichier
    // Par exemple, sauvegarder le fichier ou traiter son contenu

    return NextResponse.json(
      { message: 'Fichier téléversé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors du téléversement:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier' },
      { status: 500 }
    );
  }
} 