import { useState, useEffect } from 'react';
import BulletinPreview from './components/BulletinPreview';
import './App.css';

interface Eleve {
  id: number;
  nom: string;
  prenoms: string;
}

interface Matiere {
  id: number;
  nom: string;
  coefficient: number;
}

interface Note {
  eleve_id: number;
  matiere_id: number;
  trimestre: number;
  moyenne_classe: number;
  note_composition: number;
}

function App() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<number>(1);
  const [selectedMatiere, setSelectedMatiere] = useState<number>(1);
  const [trimestre, setTrimestre] = useState<number>(1);
  const [notes, setNotes] = useState<Record<string, { moyenne_classe: number; note_composition: number }>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<'saisie' | 'bulletin'>('saisie');
  const [bulletinData, setBulletinData] = useState<any>(null);
  const [selectedEleve, setSelectedEleve] = useState<number>(1);

  useEffect(() => {
    loadData();
  }, [selectedClasse]);

  const loadData = async () => {
    try {
      const [elevesRes, matieresRes] = await Promise.all([
        fetch(`http://localhost:3000/api/eleves?classe_id=${selectedClasse}`),
        fetch(`http://localhost:3000/api/matieres?classe_id=${selectedClasse}`)
      ]);
      
      const elevesData = await elevesRes.json();
      const matieresData = await matieresRes.json();
      
      setEleves(elevesData);
      setMatieres(matieresData);
      if (elevesData.length > 0) {
        setSelectedEleve(elevesData[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleNoteChange = (eleveId: number, field: 'moyenne_classe' | 'note_composition', value: string) => {
    const numValue = parseFloat(value) || 0;
    const key = `${eleveId}`;
    
    setNotes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: numValue
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const notesArray = Object.entries(notes).map(([eleveId, note]) => ({
        eleve_id: parseInt(eleveId),
        matiere_id: selectedMatiere,
        trimestre: trimestre as 1 | 2 | 3,
        moyenne_classe: note.moyenne_classe,
        note_composition: note.note_composition
      }));
      
      const response = await fetch('http://localhost:3000/api/notes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesArray })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage(`${result.successCount} notes enregistrées avec succès`);
        setNotes({});
      } else {
        setMessage(`Erreur: ${result.error}`);
      }
    } catch (error) {
      setMessage('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBulletin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://localhost:3000/api/bulletins/eleve/${selectedEleve}/trimestre/${trimestre}`);
      const data = await response.json();
      
      if (response.ok) {
        setBulletinData(data);
        setView('bulletin');
      } else {
        setMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setMessage('Erreur lors de la génération du bulletin');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'bulletin' && bulletinData) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Bulletin Scolaire</h1>
            <button
              onClick={() => setView('saisie')}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Retour à la saisie
            </button>
          </div>
          <BulletinPreview data={bulletinData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Saisie des Notes - Bulletins Scolaires Togo</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trimestre</label>
              <select
                value={trimestre}
                onChange={(e) => setTrimestre(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value={1}>1er Trimestre</option>
                <option value={2}>2ème Trimestre</option>
                <option value={3}>3ème Trimestre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
              <select
                value={selectedMatiere}
                onChange={(e) => setSelectedMatiere(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nom} (Coef: {m.coefficient})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Élève pour bulletin</label>
              <select
                value={selectedEleve}
                onChange={(e) => setSelectedEleve(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                {eleves.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom} {e.prenoms}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Élève</th>
                <th className="text-center p-3">Moy. Classe (0-20)</th>
                <th className="text-center p-3">Composition (0-20)</th>
              </tr>
            </thead>
            <tbody>
              {eleves.map((eleve) => {
                const key = `${eleve.id}`;
                const note = notes[key] || { moyenne_classe: 0, note_composition: 0 };
                
                return (
                  <tr key={eleve.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {eleve.nom} {eleve.prenoms}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={note.moyenne_classe || ''}
                        onChange={(e) => handleNoteChange(eleve.id, 'moyenne_classe', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-center"
                        placeholder="0-20"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={note.note_composition || ''}
                        onChange={(e) => handleNoteChange(eleve.id, 'note_composition', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-center"
                        placeholder="0-20"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {eleves.length} élève(s)
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleGenerateBulletin}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Génération...' : 'Voir bulletin'}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les notes'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
