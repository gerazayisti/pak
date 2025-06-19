const XLSX = require('xlsx');

// Lire le fichier Excel
const workbook = XLSX.readFile('kpi.xlsx');

// Obtenir les noms des feuilles
const sheetNames = workbook.SheetNames;
console.log('Feuilles disponibles:', sheetNames);

// Pour chaque feuille, afficher son contenu
sheetNames.forEach(sheetName => {
  console.log(`\nContenu de la feuille "${sheetName}":`);
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  console.log(data);
}); 