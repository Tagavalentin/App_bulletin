import React from 'react';

interface BulletinData {
  etablissement: any;
  classe: any;
  eleve: any;
  trimestre: number;
  matieres_litteraires: any[];
  matieres_scientifiques: any[];
  matieres_eps: any[];
  groupe_litteraire: any;
  groupe_scientifique: any;
  groupe_eps: any;
  total_coefficients: number;
  total_notes: number;
  moyenne_trimestre: number;
  moyenne_lettres: string;
  rang_general: number;
  rang_general_ex_aequo: boolean;
  appreciation: string;
  faible_moyenne: number;
  forte_moyenne: number;
}

interface BulletinPreviewProps {
  data: BulletinData;
}

const BulletinPreview: React.FC<BulletinPreviewProps> = ({ data }) => {
  const trimestreLibelle = data.trimestre === 1 ? 'PREMIER' : data.trimestre === 2 ? 'DEUXIEME' : 'TROISIEME';

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/pdf/eleve/${data.eleve.id}/trimestre/${data.trimestre}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulletin_T${data.trimestre}_${data.eleve.nom}_${data.eleve.prenoms}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors de l\'export PDF');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 border-2 border-black">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Exporter en PDF
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
      {/* En-tête */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <p className="font-bold">N° d'agrément: {data.etablissement?.numero_agrement || 'N/A'}</p>
          <p className="font-bold">{data.etablissement?.ministere}</p>
          <p className="font-bold">{data.etablissement?.direction_regionale}</p>
          <p className="font-bold">{data.etablissement?.nom}</p>
          <p>{data.etablissement?.adresse}</p>
          <p>{data.etablissement?.telephones}</p>
          <p>{data.etablissement?.ville}</p>
        </div>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gray-200 flex items-center justify-center border">
            Logo
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">REPUBLIQUE TOGOLAISE</p>
          <p className="font-bold">Travail-Liberté-Patrie</p>
          <p>Année scolaire: 2025-2026</p>
          <p>Classe: {data.classe?.nom}</p>
          <p>Effectif: {data.classe?.effectif}</p>
          <p>Statut: {data.eleve?.statut}</p>
          <p>Sexe: {data.eleve?.sexe}</p>
        </div>
      </div>

      {/* Titre */}
      <div className="border-2 border-black p-2 text-center mb-4">
        <h2 className="text-xl font-bold">BULLETIN D'EVALUATION DU {trimestreLibelle} TRIMESTRE</h2>
      </div>

      {/* Nom élève */}
      <div className="mb-4">
        <p className="font-bold">NOM ET PRENOMS: {data.eleve?.nom} {data.eleve?.prenoms}</p>
      </div>

      {/* Tableau littéraire */}
      <table className="w-full border-collapse border border-black mb-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-1 text-left">MATIERES LITTERAIRES</th>
            <th className="border border-black p-1">Moy Classe</th>
            <th className="border border-black p-1">COMP.</th>
            <th className="border border-black p-1">MOY. Trim</th>
            <th className="border border-black p-1">Coef</th>
            <th className="border border-black p-1">Notes Définitives</th>
            <th className="border border-black p-1">Rang</th>
            <th className="border border-black p-1">Appréciations</th>
          </tr>
        </thead>
        <tbody>
          {data.matieres_litteraires.map((m, i) => (
            <tr key={i}>
              <td className="border border-black p-1">{m.nom}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_classe || '-'}</td>
              <td className="border border-black p-1 text-center">{m.note_composition || '-'}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_trim.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">{m.coefficient}</td>
              <td className="border border-black p-1 text-center">{m.note_definitive.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">-</td>
              <td className="border border-black p-1 text-center">{m.appreciation}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="border border-black p-1">TOTAL</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1 text-center">{data.groupe_litteraire.totalCoefficients}</td>
            <td className="border border-black p-1 text-center">{data.groupe_litteraire.totalNotes.toFixed(2)}</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
          </tr>
          <tr className="bg-gray-200 font-bold">
            <td className="border border-black p-1">MOYENNE</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1 text-center">{data.groupe_litteraire.moyenneGroupe.toFixed(2)}</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
          </tr>
        </tbody>
      </table>

      {/* Tableau scientifique */}
      <table className="w-full border-collapse border border-black mb-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-1 text-left">MATIERES SCIENTIFIQUES</th>
            <th className="border border-black p-1">Moy Classe</th>
            <th className="border border-black p-1">COMP.</th>
            <th className="border border-black p-1">MOY. Trim</th>
            <th className="border border-black p-1">Coef</th>
            <th className="border border-black p-1">Notes Définitives</th>
            <th className="border border-black p-1">Rang</th>
            <th className="border border-black p-1">Appréciations</th>
          </tr>
        </thead>
        <tbody>
          {data.matieres_scientifiques.map((m, i) => (
            <tr key={i}>
              <td className="border border-black p-1">{m.nom}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_classe || '-'}</td>
              <td className="border border-black p-1 text-center">{m.note_composition || '-'}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_trim.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">{m.coefficient}</td>
              <td className="border border-black p-1 text-center">{m.note_definitive.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">-</td>
              <td className="border border-black p-1 text-center">{m.appreciation}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="border border-black p-1">TOTAL</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1 text-center">{data.groupe_scientifique.totalCoefficients}</td>
            <td className="border border-black p-1 text-center">{data.groupe_scientifique.totalNotes.toFixed(2)}</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
          </tr>
          <tr className="bg-gray-200 font-bold">
            <td className="border border-black p-1">MOYENNE</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1 text-center">{data.groupe_scientifique.moyenneGroupe.toFixed(2)}</td>
            <td className="border border-black p-1"></td>
            <td className="border border-black p-1"></td>
          </tr>
        </tbody>
      </table>

      {/* Tableau EPS */}
      <table className="w-full border-collapse border border-black mb-4 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-1 text-left">MATIERES E.P.S.</th>
            <th className="border border-black p-1">Moy Classe</th>
            <th className="border border-black p-1">COMP.</th>
            <th className="border border-black p-1">MOY. Trim</th>
            <th className="border border-black p-1">Coef</th>
            <th className="border border-black p-1">Notes Définitives</th>
            <th className="border border-black p-1">Rang</th>
            <th className="border border-black p-1">Appréciations</th>
          </tr>
        </thead>
        <tbody>
          {data.matieres_eps.map((m, i) => (
            <tr key={i}>
              <td className="border border-black p-1">{m.nom}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_classe || '-'}</td>
              <td className="border border-black p-1 text-center">{m.note_composition || '-'}</td>
              <td className="border border-black p-1 text-center">{m.moyenne_trim.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">{m.coefficient}</td>
              <td className="border border-black p-1 text-center">{m.note_definitive.toFixed(2)}</td>
              <td className="border border-black p-1 text-center">-</td>
              <td className="border border-black p-1 text-center">{m.appreciation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totaux et moyenne générale */}
      <div className="border-2 border-black p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">TOTAUX:</p>
            <p>Coef: {data.total_coefficients}</p>
            <p>Notes: {data.total_notes.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">MOYENNE DU TRIMESTRE:</p>
            <p className="text-3xl font-bold">{data.moyenne_trimestre.toFixed(2)}</p>
            <p className="text-lg">{data.moyenne_lettres}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="font-bold">RANG:</p>
            <p>{data.rang_general}{data.rang_general_ex_aequo ? ' (ex æquo)' : ''}</p>
          </div>
          <div>
            <p className="font-bold">FAIBLE MOY:</p>
            <p>{data.faible_moyenne.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">FORTE MOY:</p>
            <p>{data.forte_moyenne.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div className="border-2 border-black p-4 mb-4">
        <p className="font-bold mb-2">OBSERVATIONS DU CHEF D'ETABLISSEMENT:</p>
        <p className="font-bold text-xl">{data.appreciation}</p>
      </div>

      {/* Bas de page */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="font-bold">VIE SCOLAIRE:</p>
          <p>Absences: _______</p>
          <p>Retards: _______</p>
          <p>Tableau d'honneur: [ ]</p>
          <p>Félicitations: [ ]</p>
          <p>Encouragements: [ ]</p>
          <p>Avertissement: [ ]</p>
          <p>Blâme: [ ]</p>
        </div>
        <div className="text-center">
          <p className="font-bold">DECISION DU CONSEIL DE CLASSE:</p>
          <p>__________________________</p>
          <p className="mt-4">Titulaire: {data.classe?.titulaire}</p>
          <p>Signature: _______________</p>
        </div>
        <div className="text-right">
          <p className="font-bold">CACHET ET SIGNATURE</p>
          <p className="mt-4">{data.etablissement?.nom_proviseur}</p>
          <p>Proviseur Fondateur</p>
          <p className="mt-4">Lomé, le {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
};

export default BulletinPreview;
