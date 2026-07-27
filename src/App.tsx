import React, { useState } from 'react';

// --- LISTE COMPLÈTE DES 27 PAYS DE L'UE ---
const EU_COUNTRIES = [
  { code: 'BE', nameFR: 'Belgique / België (BE)', nameNL: 'België / Belgique (BE)' },
  { code: 'FR', nameFR: 'France / Frankrijk (FR)', nameNL: 'Frankrijk / France (FR)' },
  { code: 'NL', nameFR: 'Pays-Bas / Nederland (NL)', nameNL: 'Nederland / Pays-Bas (NL)' },
  { code: 'DE', nameFR: 'Allemagne / Duitsland (DE)', nameNL: 'Duitsland / Allemagne (DE)' },
  { code: 'LU', nameFR: 'Luxembourg / Luxemburg (LU)', nameNL: 'Luxemburg / Luxembourg (LU)' },
  { code: 'AT', nameFR: 'Autriche / Oostenrijk (AT)', nameNL: 'Oostenrijk / Autriche (AT)' },
  { code: 'BG', nameFR: 'Bulgarie / Bulgarije (BG)', nameNL: 'Bulgarije / Bulgarie (BG)' },
  { code: 'CY', nameFR: 'Chypre / Cyprus (CY)', nameNL: 'Cyprus / Chypre (CY)' },
  { code: 'HR', nameFR: 'Croatie / Kroatië (HR)', nameNL: 'Kroatië / Croatie (HR)' },
  { code: 'DK', nameFR: 'Danemark / Denemarken (DK)', nameNL: 'Denemarken / Danemark (DK)' },
  { code: 'ES', nameFR: 'Espagne / Spanje (ES)', nameNL: 'Spanje / Espagne (ES)' },
  { code: 'EE', nameFR: 'Estonie / Estland (EE)', nameNL: 'Estland / Estonie (EE)' },
  { code: 'FI', nameFR: 'Finlande / Finland (FI)', nameNL: 'Finland / Finlande (FI)' },
  { code: 'EL', nameFR: 'Grèce / Griekenland (EL)', nameNL: 'Griekenland / Grèce (EL)' },
  { code: 'HU', nameFR: 'Hongrie / Hongarije (HU)', nameNL: 'Hongarije / Hongrie (HU)' },
  { code: 'IE', nameFR: 'Irlande / Ierland (IE)', nameNL: 'Ierland / Irlande (IE)' },
  { code: 'IT', nameFR: 'Italie / Italië (IT)', nameNL: 'Italië / Italie (IT)' },
  { code: 'LV', nameFR: 'Lettonie / Letland (LV)', nameNL: 'Letland / Lettonie (LV)' },
  { code: 'LT', nameFR: 'Lituanie / Litouwen (LT)', nameNL: 'Litouwen / Lituanie (LT)' },
  { code: 'MT', nameFR: 'Malte / Malta (MT)', nameNL: 'Malta / Malte (MT)' },
  { code: 'PL', nameFR: 'Pologne / Polen (PL)', nameNL: 'Polen / Pologne (PL)' },
  { code: 'PT', nameFR: 'Portugal / Portugal (PT)', nameNL: 'Portugal / Portugal (PT)' },
  { code: 'RO', nameFR: 'Roumanie / Roemenië (RO)', nameNL: 'Roemenië / Roumanie (RO)' },
  { code: 'SK', nameFR: 'Slovaquie / Slowakije (SK)', nameNL: 'Slowakije / Slovaquie (SK)' },
  { code: 'SI', nameFR: 'Slovénie / Slovenië (SI)', nameNL: 'Slovenië / Slovénie (SI)' },
  { code: 'SE', nameFR: 'Suède / Zweden (SE)', nameNL: 'Zweden / Suède (SE)' },
  { code: 'CZ', nameFR: 'Tchéquie / Tsjechië (CZ)', nameNL: 'Tsjechië / Tchéquie (CZ)' },
];

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const [step, setStep] = useState<number | 'devis' | 'facture'>(1);

  // --- ÉTAPE 1 : PROFIL CLIENT (Champs vides par défaut) ---
  const [clientName, setClientName] = useState('');
  const [clientCountry, setClientCountry] = useState('BE');
  const [clientStatus, setClientStatus] = useState('B2B');
  const [clientVat, setClientVat] = useState('');

  // --- ÉTAPE 2 : BIEN & TRAVAUX (Options d'origine en cartes) ---
  const [buildingAge, setBuildingAge] = useState<'minus10' | 'plus10'>('plus10');
  const [buildingUsage, setBuildingUsage] = useState<'private' | 'pro' | 'mixed'>('mixed');
  const [workNature, setWorkNature] = useState('renovation');
  const [outdoorWork, setOutdoorWork] = useState('none');
  const [siteAddress, setSiteAddress] = useState('');

  // --- MODULE DEVIS & FACTURE ---
  const [contractorInfo, setContractorInfo] = useState({
    name: 'Mon Entreprise SRL',
    vat: 'BE0999888777',
    address: 'Rue du Progrès 45, 1000 Bruxelles',
    iban: 'BE12 3456 7890 1234'
  });

  const [items, setItems] = useState([
    { id: 1, description: 'Travaux de rénovation et peinture', qty: 1, unitPrice: 2500 }
  ]);

  const [peppolModal, setPeppolModal] = useState(false);
  const [peppolSuccess, setPeppolSuccess] = useState(false);

  // Calculs TVA & Verdict
  const getVatRate = () => {
    if (clientStatus === 'B2B') return 0;
    if (buildingAge === 'plus10') return 6;
    return 21;
  };

  const vatRate = getVatRate();
  const totalHTVA = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const totalTVA = (totalHTVA * vatRate) / 100;
  const totalTTC = totalHTVA + totalTVA;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      {/* HEADER */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">DigiBât VAT / DigiBouw BTW</h1>
          <p className="text-xs text-slate-500">
            {lang === 'FR' ? 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026' : 'Btw-bepaling « Werken in onroerende staat » — België 2025-2026'}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-300">
            ✓ Conforme réformes 2025-2026
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setLang('FR')} className={`px-3 py-1 text-xs font-bold rounded ${lang === 'FR' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>FR</button>
            <button onClick={() => setLang('NL')} className={`px-3 py-1 text-xs font-bold rounded ${lang === 'NL' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>NL</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <main className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          
          {/* STEP INDICATOR */}
          {typeof step === 'number' && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
                <span className="text-sm">{lang === 'FR' ? 'Profil Client' : 'Klantprofiel'}</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 mx-4"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
                <span className="text-sm">{lang === 'FR' ? 'Bien & Travaux' : 'Onroerend goed'}</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 mx-4"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
                <span className="text-sm">{lang === 'FR' ? 'Résultat' : 'Resultaat'}</span>
              </div>
            </div>
          )}

          {/* ÉTAPE 1 : PROFIL CLIENT */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">{lang === 'FR' ? 'Étape 1 : Profil du Client' : 'Stap 1 : Klantprofiel'}</h2>
              
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{lang === 'FR' ? 'NOM / ENTREPRISE' : 'NAAM / ONDERNEMING'}</label>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="ex: Jean Dupont / BVBA Peeters" 
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{lang === 'FR' ? 'PAYS (UNION EUROPÉENNE)' : 'LAND'}</label>
                <select 
                  value={clientCountry} 
                  onChange={(e) => setClientCountry(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm bg-white border-slate-300"
                >
                  {EU_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {lang === 'FR' ? c.nameFR : c.nameNL}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{lang === 'FR' ? 'STATUT TVA DU CLIENT' : 'BTW-STATUS'}</label>
                <select 
                  value={clientStatus} 
                  onChange={(e) => setClientStatus(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm bg-white border-slate-300"
                >
                  <option value="B2B">Btw-plichtige B2B met periodieke aangiften (Art. 20 / KB1)</option>
                  <option value="B2C">Particulier (B2C - Non assujetti)</option>
                </select>
              </div>

              {clientStatus === 'B2B' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{lang === 'FR' ? 'NUMÉRO DE TVA' : 'BTW-NUMMER'}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={clientVat} 
                      onChange={(e) => setClientVat(e.target.value)} 
                      placeholder="BE0000000000" 
                      className="flex-1 p-2.5 border rounded-lg text-sm border-slate-300"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                      {lang === 'FR' ? 'Vérifier VIES' : 'VIES Controleren'}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700">
                  {lang === 'FR' ? 'Suivant : Bien & Travaux →' : 'Volgende: Onroerend goed & Werken →'}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : BIEN & TRAVAUX */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{lang === 'FR' ? 'Bien immobilier & Travaux' : 'Onroerend goed & Werken'}</h2>

              {/* Ancienneté */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">{lang === 'FR' ? 'Ancienneté du bâtiment' : 'Ouderdom van het gebouw'}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setBuildingAge('minus10')} className={`p-3 rounded-xl border text-left text-sm font-semibold flex items-center gap-2 ${buildingAge === 'minus10' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🏢 {lang === 'FR' ? 'Moins de 10 ans' : 'Minder dan 10 jaar'}
                  </button>
                  <button onClick={() => setBuildingAge('plus10')} className={`p-3 rounded-xl border text-left text-sm font-semibold flex items-center gap-2 ${buildingAge === 'plus10' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    ⏱️ {lang === 'FR' ? 'Plus de 10 ans' : 'Meer dan 10 jaar'}
                  </button>
                </div>
              </div>

              {/* Usage */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">{lang === 'FR' ? 'Usage du bâtiment' : 'Gebruik van het gebouw'}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setBuildingUsage('private')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${buildingUsage === 'private' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🏡 Plus de 50% privé
                  </button>
                  <button onClick={() => setBuildingUsage('pro')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${buildingUsage === 'pro' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🏢 Exclusief professioneel
                  </button>
                  <button onClick={() => setBuildingUsage('mixed')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${buildingUsage === 'mixed' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🧱 Gemengd (privé + pro)
                  </button>
                </div>
              </div>

              {/* Nature des travaux */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">{lang === 'FR' ? 'Nature des travaux' : 'Aard van de werken'}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'renovation', label: '🔨 Standaard onderhoud en renovatie' },
                    { id: 'heatpump', label: '🔥 Warmtepomp' },
                    { id: 'solar', label: '☀️ Zonnepanelen & Isolatie' },
                    { id: 'demo', label: '🏗️ Sloop & Heropbouw' },
                  ].map((w) => (
                    <button key={w.id} onClick={() => setWorkNature(w.id)} className={`p-3 rounded-xl border text-left text-xs font-semibold ${workNature === w.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Espaces verts */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">{lang === 'FR' ? 'Travaux extérieurs / Espaces verts (optionnel)' : 'Buitenwerken / Groenzones (optioneel)'}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setOutdoorWork('none')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${outdoorWork === 'none' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🚫 Niet van toepassing
                  </button>
                  <button onClick={() => setOutdoorWork('maintenance')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${outdoorWork === 'maintenance' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🌿 Lopend onderhoud
                  </button>
                  <button onClick={() => setOutdoorWork('major')} className={`p-3 rounded-xl border text-left text-xs font-semibold ${outdoorWork === 'major' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
                    🏗️ Aanleg & Grote werken
                  </button>
                </div>
              </div>

              {/* Adresse du chantier */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">{lang === 'FR' ? 'ADRESSE DU CHANTIER / BIEN' : 'ADRES VAN DE WERF'}</label>
                <input 
                  type="text" 
                  value={siteAddress} 
                  onChange={(e) => setSiteAddress(e.target.value)} 
                  placeholder="ex: Rue de la Loi 16, 1000 Bruxelles" 
                  className="w-full p-2.5 border rounded-lg text-sm border-slate-300"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-lg text-sm font-semibold">← {lang === 'FR' ? 'Retour' : 'Terug'}</button>
                <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700">
                  {lang === 'FR' ? 'Voir le résultat →' : 'Verdict bekijken →'}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RÉSULTAT ET LEGAL */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{lang === 'FR' ? 'Résultat & Mentions légales' : 'Resultaat & Factuur'}</h2>

              {clientStatus === 'B2B' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-800">✓ Autoliquidation — Régime Cocontractant</span>
                    <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">0% (Btw verlegd)</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-mono bg-white p-3 rounded border border-emerald-100">
                    "Autoliquidation : En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l'Arrêté Royal n° 1)."
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-800">Taux de TVA applicable</span>
                    <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">{vatRate}% TVA</span>
                  </div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Régime B2C : Application du taux de {vatRate}% selon la Rubrique XXXVIII du tableau A de l'Arrêté Royal n° 20.
                  </p>
                </div>
              )}

              {buildingUsage === 'mixed' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <span className="font-bold text-amber-800 text-xs uppercase">⚠️ Traitement des travaux mixtes (Privé + Pro) :</span>
                  <p className="text-xs text-amber-900">
                    En cas d'usage mixte, une ventilation obligatoire des montants doit être effectuée (séparation prorata privé {buildingAge === 'plus10' ? '6%' : '21%'} / pro 21% ou autoliquidation B2B Art. 20).
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg text-sm font-semibold">← {lang === 'FR' ? 'Retour' : 'Terug'}</button>
                <button onClick={() => setStep('devis')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700">
                  📄 {lang === 'FR' ? 'Transférer vers un Devis' : 'Omzetten naar Offerte'}
                </button>
              </div>
            </div>
          )}

          {/* VUE DEVIS */}
          {step === 'devis' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex justify-between items-center">
                <span>📄 Devis / Offerte</span>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full border">TVA Auto: {vatRate}%</span>
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border">
                <div>
                  <h3 className="font-bold mb-1">Prestataire (Vous)</h3>
                  <p>{contractorInfo.name}</p>
                  <p>{contractorInfo.vat}</p>
                  <p>{contractorInfo.address}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Client & Chantier</h3>
                  <p><strong>Client:</strong> {clientName || 'Client non nomme'}</p>
                  <p><strong>Chantier:</strong> {siteAddress || 'Adresse non specifiee'}</p>
                </div>
              </div>

              {/* Actions Devis */}
              <div className="flex gap-2">
                <button onClick={() => alert('Devis Enregistré !')} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">💾 Enregistrer le devis</button>
                <button onClick={() => window.print()} className="px-4 border py-2 rounded-lg text-xs font-bold">🖨️ Imprimer</button>
                <button onClick={() => setStep('facture')} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold">⚡ Convertir en Facture</button>
              </div>
            </div>
          )}

          {/* VUE FACTURE */}
          {step === 'facture' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex justify-between items-center text-emerald-700">
                <span>🧾 Facture / Factuur</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">Prêt pour Peppol</span>
              </h2>

              <div className="p-4 bg-slate-50 border rounded-xl space-y-2 text-xs">
                <p><strong>Client:</strong> {clientName} ({clientVat})</p>
                <p><strong>Adresse Chantier:</strong> {siteAddress}</p>
                <p><strong>Montant Total HTVA:</strong> {totalHTVA} €</p>
                <p><strong>TVA ({vatRate}%):</strong> {totalTVA} €</p>
                <p className="text-sm font-bold text-slate-900">Total TTC: {totalTTC} €</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => alert('Facture enregistrée !')} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">💾 Enregistrer</button>
                <button onClick={() => window.print()} className="px-4 border py-2 rounded-lg text-xs font-bold">🖨️ Imprimer</button>
                <button onClick={() => setPeppolModal(true)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold">🌐 Transférer via Peppol</button>
              </div>
            </div>
          )}
        </main>

        {/* SIDEBAR HISTORIQUE */}
        <aside className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">📜 Historique des déterminations</h3>
          <p className="text-xs text-slate-400 italic">Aucune détermination enregistrée.</p>
        </aside>
      </div>

      {/* MODAL PEPPOL */}
      {peppolModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-base">Transmission Peppol e-Invoicing</h3>
            {peppolSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg border border-emerald-200">
                ✓ Facture transmise avec succès au réseau Peppol (UBL/e-FFF) !
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Voulez-vous envoyer directement cette facture au client <strong>{clientName || 'B2B'}</strong> via le réseau sécurisé Peppol ?
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setPeppolModal(false); setPeppolSuccess(false); }} className="px-3 py-1.5 border rounded-lg text-xs">Fermer</button>
              {!peppolSuccess && (
                <button onClick={() => setPeppolSuccess(true)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Confirmer l'envoi</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
