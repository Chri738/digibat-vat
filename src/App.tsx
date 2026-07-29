import React, { useState } from 'react';
import { DevisFactureScreen } from './components/DevisFactureScreen';
import { DocumentEditor, VerdictData } from './components/DocumentEditor';

export function App() {
  const [currentMode, setCurrentMode] = useState<'calculator' | 'editor'>('calculator');
  const [docType, setDocType] = useState<'DEVIS' | 'FACTURE'>('FACTURE');
  const [docNumber] = useState<string>('2026-001');
  const [verdictData, setVerdictData] = useState<VerdictData>({
    clientName: 'Client Exemple SRL',
    clientVat: 'BE0123456789',
    clientCountry: 'BE',
    regimeTitle: 'TVA Cocontractant (Régime A.R. n°1)',
    vatRate: 0,
    legalMention: "Autoliquidation - Article 20 de l'arrêté royal n° 1 / Btw verlegd - Artikel 20 van het Koninklijk Besluit nr. 1."
  });

  const handleOpenEditor = (type: 'DEVIS' | 'FACTURE', data?: Partial<VerdictData>) => {
    setDocType(type);
    if (data) {
      setVerdictData(prev => ({ ...prev, ...data }));
    }
    setCurrentMode('editor');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md no-print">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-black text-blue-400">DigiBat VAT</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
              Belgique / België
            </span>
          </div>

          <nav className="flex space-x-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCurrentMode('calculator')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentMode === 'calculator' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              📊 Calculateur TVA
            </button>
            <button
              type="button"
              onClick={() => handleOpenEditor('FACTURE')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentMode === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              📄 Éditeur Facture / Devis
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {currentMode === 'calculator' ? (
          <DevisFactureScreen
            onGenerateDocument={(type: 'DEVIS' | 'FACTURE', verdict: any) => {
              handleOpenEditor(type, verdict);
            }}
          />
        ) : (
          <DocumentEditor
            documentType={docType}
            documentNumber={docNumber}
            verdict={verdictData}
            onBackToCalculator={() => setCurrentMode('calculator')}
            onSendPeppol={(payload) => {
              console.log('Peppol Payload:', payload);
              alert('Document prêt pour l\'envoi Peppol !');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
