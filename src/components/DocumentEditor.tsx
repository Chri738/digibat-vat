import React, { useState } from 'react';
import { EntrepreneurHeader } from './EntrepreneurHeader';

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface VerdictData {
  clientName: string;
  clientVat: string;
  clientCountry: string;
  regimeTitle: string;
  vatRate: number;
  legalMention: string;
}

interface DocumentEditorProps {
  documentType: 'DEVIS' | 'FACTURE';
  documentNumber: string;
  verdict: VerdictData;
  onBackToCalculator: () => void;
  onSendPeppol: (payload: any) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  documentType,
  documentNumber,
  verdict,
  onBackToCalculator,
  onSendPeppol
}) => {
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  const [items, setItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Standaard onderhoud en renovatiewerken / Travaux de rénovation',
      qty: 1,
      unitPrice: 1500
    }
  ]);

  const handleItemChange = (id: string, field: keyof LineItem, val: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', qty: 1, unitPrice: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const subtotalHTVA = items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  const vatAmount = subtotalHTVA * (verdict.vatRate / 100);
  const totalTTC = subtotalHTVA + vatAmount;

  const handlePeppolExport = () => {
    const peppolPayload = {
      type: documentType,
      documentNumber,
      deliveryDate: documentType === 'FACTURE' ? deliveryDate : undefined,
      client: {
        name: verdict.clientName,
        vat: verdict.clientVat,
        country: verdict.clientCountry
      },
      items,
      subtotalHTVA,
      vatRate: verdict.vatRate,
      vatAmount,
      totalTTC,
      legalMention: verdict.legalMention
    };

    onSendPeppol(peppolPayload);
  };

  return (
    <div className="document-container max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{documentType}</span>
          <h1 className="text-2xl font-black text-slate-900">{documentType === 'DEVIS' ? 'Devis' : 'Facture'}</h1>
          <p className="text-xs text-slate-500">{documentType} N° : {documentNumber}</p>
        </div>
        <button
          onClick={onBackToCalculator}
          className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg"
        >
          ← Terug naar calculator
        </button>
      </div>

      {documentType === 'FACTURE' && (
        <div className="mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center gap-4">
          <label className="text-xs font-semibold text-blue-900 whitespace-nowrap">
            Date de livraison du chantier :
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="text-sm border border-blue-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EntrepreneurHeader />

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client</h4>
            <div className="font-bold text-slate-800 text-base">{verdict.clientName || 'Nom du client'}</div>
            <div className="text-sm text-slate-600">{verdict.clientVat || 'BE0000000000'}</div>
            <div className="text-sm text-slate-600">{verdict.clientCountry}</div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              {verdict.regimeTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-slate-800">Prestations & Matériaux</h3>
          <button
            onClick={addItem}
            className="text-xs text-blue-600 font-semibold hover:underline no-print"
          >
            + Ajouter une ligne
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-xs font-bold text-slate-600 uppercase border-y border-slate-200">
              <th className="py-2.5 px-3">Description</th>
              <th className="py-2.5 px-3 text-center w-20">Qté</th>
              <th className="py-2.5 px-3 text-right w-32">Prix Unit. (€)</th>
              <th className="py-2.5 px-3 text-right w-36">Total HTVA (€)</th>
              <th className="w-8 no-print"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm text-center border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="py-2 px-3">
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full text-sm text-right border border-slate-200 rounded px-2 py-1 font-semibold focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="py-2 px-3 text-right font-bold text-slate-800 text-sm">
                  {(item.qty * item.unitPrice).toFixed(2)} €
                </td>
                <td className="py-2 px-1 text-center no-print">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-full max-w-sm bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Sous-total HTVA:</span>
            <span className="font-semibold">{subtotalHTVA.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-emerald-700">
            <span>
              Montant TVA ({verdict.vatRate}% {verdict.vatRate === 0 ? 'Autoliquidation / Btw verlegd' : ''}):
            </span>
            <span>{vatAmount.toFixed(2)} €</span>
          </div>
          <div className="border-t border-slate-300 pt-2 flex justify-between text-base font-black text-slate-900">
            <span>TOTAL TTC:</span>
            <span>{totalTTC.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-8 text-xs text-slate-700 leading-relaxed">
        <div className="font-bold text-slate-900 mb-1">Mention légale obligatoire à faire figurer sur le document :</div>
        <p className="italic">"{verdict.legalMention}"</p>
      </div>

      <div className="flex justify-between items-center no-print pt-4 border-t border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => alert('Document enregistré avec succès !')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            💾 Enregistrer la facture
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
          >
            🖨️ Imprimer la facture
          </button>
        </div>
        
        <button
          onClick={handlePeppolExport}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          🌐 Transférer via Peppol
        </button>
      </div>
    </div>
  );
};
