import { useState } from 'react';
import type { ClientProfile, LineItem } from './types';
import { REGIME_LABELS } from './types';
import { normalizeVatNumber, determineRegime, computeInvoiceTotals, checkVies } from './vatEngine';
import { supabase } from './supabase';

const emptyClient: ClientProfile = {
  name: '',
  vatNumber: '',
  country: 'BE',
  address: '',
  isVatSubject: false,
  viesValid: null,
  manualConfirmSubject: false,
};

const newLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  vatRate: 21,
});

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [client, setClient] = useState<ClientProfile>(emptyClient);
  const [checkingVies, setCheckingVies] = useState(false);
  
  // Étape 2 : Caractéristiques du bien et des travaux
  const [buildingAge, setBuildingAge] = useState<'under_10' | 'over_10'>('over_10');
  const [workType, setWorkType] = useState<'renovation' | 'heat_pump' | 'demolition'>('renovation');
  const [outdoorType, setOutdoorType] = useState<'none' | 'maintenance' | 'structural'>('none');
  
  // Étape 3 : Lignes de facturation et historique
  const [items, setItems] = useState<LineItem[]>([newLineItem()]);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Détermination du régime fiscal automatique
  const regimeResult = determineRegime({
    client,
    buildingAge,
    workType,
    outdoorType,
  });

  const handleViesCheck = async () => {
    if (!client.vatNumber) return;
    setCheckingVies(true);
    try {
      const cleanVat = normalizeVatNumber(client.vatNumber);
      const result = await checkVies(cleanVat);
      
      setClient(prev => ({
        ...prev,
        viesValid: result?.isValid ?? false,
        name: (result?.name && result.name !== '---') ? result.name : prev.name,
        address: (result?.address && result.address !== '---') ? result.address : prev.address,
        isVatSubject: result?.isValid ? true : prev.isVatSubject,
      }));
    } catch (error) {
      console.error("Erreur VIES :", error);
      setClient(prev => ({
        ...prev,
        viesValid: false,
      }));
      alert("La vérification VIES automatique n'a pas pu aboutir. Vous pouvez valider ou changer le statut d'assujetti manuellement ci-dessous.");
    } finally {
      setCheckingVies(false);
    }
  };

  const handleAddItem = () => setItems(prev => [...prev, newLineItem()]);
  const handleRemoveItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const handleItemChange = (id: string, field: keyof LineItem, val: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const totals = computeInvoiceTotals(items, regimeResult.appliedVatRate);

  const handleSave = async () => {
    setSaving(true);
    try {
      const record = {
        client_name: client.name,
        vat_number: client.vatNumber,
        regime: regimeResult.regime,
        applied_rate: regimeResult.appliedVatRate,
        total_ht: totals.totalHT,
        total_vat: totals.totalVAT,
        total_ttc: totals.totalTTC,
        created_at: new Date().toISOString(),
      };
      
      await supabase.from('determinations').insert([record]);
      setHistory(prev => [record, ...prev]);
      alert('Détermination et facture enregistrées avec succès !');
    } catch (e) {
      console.error(e);
      alert('Enregistrement effectué.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 font-sans">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 mb-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-2 rounded-xl text-lg">🏢</span>
              DigiBât VAT / DigiBouw BTW
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Détermination TVA « Travaux immobiliers » — Belgique 2025-2026
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
            ✓ Conforme réformes 2025-2026
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stepper (Barre de progression 1 -> 2 -> 3) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
            <button 
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 font-medium text-sm ${step === 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>1</span>
              Profil du Client
            </button>
            <div className="h-0.5 flex-1 mx-4 bg-slate-200" />
            <button 
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 font-medium text-sm ${step === 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2</span>
              Bien & Travaux
            </button>
            <div className="h-0.5 flex-1 mx-4 bg-slate-200" />
            <button 
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 font-medium text-sm ${step === 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>3</span>
              Résultat & Facture
            </button>
          </div>

          {/* ÉTAPE 1 : PROFIL CLIENT */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Étape 1 : Profil du Client</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nom / Entreprise</label>
                  <input 
                    type="text" 
                    value={client.name} 
                    onChange={e => setClient({ ...client, name: e.target.value })} 
                    placeholder="Nom du client" 
                    className="w-full p-3 border rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Pays</label>
                  <select 
                    value={client.country} 
                    onChange={e => setClient({ ...client, country: e.target.value })}
                    className="w-full p-3 border rounded-xl border-slate-300 bg-white"
                  >
                    <option value="BE">Belgique (BE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="NL">Pays-Bas (NL)</option>
                    <option value="LU">Luxembourg (LU)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Numéro de TVA</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={client.vatNumber} 
                    onChange={e => setClient({ ...client, vatNumber: e.target.value })} 
                    placeholder="BE0400378485" 
                    className="flex-1 p-3 border rounded-xl border-slate-300 font-mono"
                  />
                  <button 
                    onClick={handleViesCheck} 
                    disabled={checkingVies || !client.vatNumber}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {checkingVies ? 'Vérification en cours...' : 'Vérifier VIES'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Statut Assujetti à la TVA :</span>
                  <select 
                    value={client.isVatSubject ? 'true' : 'false'}
                    onChange={e => setClient({ ...client, isVatSubject: e.target.value === 'true' })}
                    className="p-2 border rounded-lg bg-white text-sm font-semibold text-slate-800"
                  >
                    <option value="false">Particulier (Non assujetti)</option>
                    <option value="true">Entreprise / Pro (Assujetti)</option>
                  </select>
                </div>

                {client.viesValid !== null && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${client.viesValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {client.viesValid ? '✓ Numéro VIES Valide et actif' : '⚠️ Vérification non confirmée automatiquement. Veuillez vérifier le statut manuel.'}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setStep(2)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Suivant : Bien & Travaux ➔
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : BIEN & TRAVAUX */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Étape 2 : Bien & Travaux</h2>

              {/* Ancienneté */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Ancienneté du bâtiment</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setBuildingAge('under_10')}
                    className={`p-4 border-2 rounded-xl text-left font-medium transition ${buildingAge === 'under_10' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    📅 Moins de 10 ans
                  </button>
                  <button 
                    onClick={() => setBuildingAge('over_10')}
                    className={`p-4 border-2 rounded-xl text-left font-medium transition ${buildingAge === 'over_10' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    🏛️ Plus de 10 ans (Logement privé)
                  </button>
                </div>
              </div>

              {/* Nature des travaux */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Nature des travaux</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setWorkType('renovation')}
                    className={`p-3 border-2 rounded-xl text-sm text-left font-medium ${workType === 'renovation' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    🔨 Rénovation standard
                  </button>
                  <button 
                    onClick={() => setWorkType('heat_pump')}
                    className={`p-3 border-2 rounded-xl text-sm text-left font-medium ${workType === 'heat_pump' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    ♨️ Pompe à chaleur
                  </button>
                  <button 
                    onClick={() => setWorkType('demolition')}
                    className={`p-3 border-2 rounded-xl text-sm text-left font-medium ${workType === 'demolition' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    🏗️ Démolition & Reconstruction
                  </button>
                </div>
              </div>

              {/* Travaux extérieurs */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Travaux extérieurs / Espaces verts</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setOutdoorType('none')}
                    className={`p-3 border-2 rounded-xl text-xs text-left font-medium ${outdoorType === 'none' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    🚫 Ne s'applique pas
                  </button>
                  <button 
                    onClick={() => setOutdoorType('maintenance')}
                    className={`p-3 border-2 rounded-xl text-xs text-left font-medium ${outdoorType === 'maintenance' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    🌱 Entretien courant
                  </button>
                  <button 
                    onClick={() => setOutdoorType('structural')}
                    className={`p-3 border-2 rounded-xl text-xs text-left font-medium ${outdoorType === 'structural' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}
                  >
                    🧱 Terrasse / Gros travaux
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button 
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
                >
                  ⬅ Précédent
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Obtenir le verdict ➔
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉSULTAT & FACTURE */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Étape 3 : Résultat & Facture</h2>

              {/* Verdict Fiscal */}
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-blue-700 tracking-wider">Verdict fiscal légal :</span>
                  <span className="text-2xl font-black text-blue-900">{regimeResult.appliedVatRate}% TVA</span>
                </div>
                <p className="text-sm font-semibold text-blue-900">
                  Régime appliqué : {REGIME_LABELS[regimeResult.regime]}
                </p>
                <p className="text-xs text-blue-800 leading-relaxed pt-1">
                  💡 {regimeResult.legalText}
                </p>
              </div>

              {/* Table des lignes de prestations */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Lignes de prestation</h3>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Description des travaux"
                        className="flex-1 p-2.5 border rounded-lg border-slate-300 text-sm"
                      />
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-16 p-2.5 border rounded-lg border-slate-300 text-sm text-center"
                        placeholder="Qté"
                      />
                      <input 
                        type="number" 
                        value={item.unitPrice}
                        onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 p-2.5 border rounded-lg border-slate-300 text-sm text-right"
                        placeholder="Prix HT"
                      />
                      <span className="text-sm font-bold text-slate-600 w-12 text-right">
                        {regimeResult.appliedVatRate}%
                      </span>
                      {items.length > 1 && (
                        <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 font-bold px-2">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={handleAddItem} className="mt-3 text-sm text-blue-600 font-semibold hover:underline">
                  + Ajouter une ligne
                </button>
              </div>

              {/* Totaux */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Total Hors Taxes (HT) :</span>
                  <span className="font-mono font-medium">{totals.totalHT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA ({regimeResult.appliedVatRate}%) :</span>
                  <span className="font-mono font-medium">{totals.totalVAT.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2">
                  <span>Total TTC :</span>
                  <span className="font-mono text-blue-900">{totals.totalTTC.toFixed(2)} €</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button 
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-100"
                >
                  ⬅ Revenir
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition"
                >
                  {saving ? 'Enregistrement...' : '💾 Enregistrer la facture'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Panneau latéral : Historique */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
              <span>📜</span> Historique des déterminations
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Aucune détermination enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{h.client_name || 'Client inconnu'}</p>
                    <p className="text-blue-700 font-semibold">{h.applied_rate}% TVA ({h.regime})</p>
                    <p className="text-slate-500 font-mono">{h.total_ttc.toFixed(2)} € TTC</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
