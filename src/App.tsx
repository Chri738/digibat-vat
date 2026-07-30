import React, { useState } from 'react';
import { FormState, LineItem } from './types';
import { EU_COUNTRIES, WORK_CATEGORIES, TRANSLATIONS } from './translations';
import { calculateVatRules } from './vatEngine';

export default function App() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [state, setState] = useState<FormState>({
    language: 'FR',
    countryCode: 'BE',
    clientType: 'B2C',
    clientName: '',
    vatNumber: '',
    isViesValidated: false,
    buildingAge: 'UNDER_10',
    buildingUsage: '100_PRIVATE',
    surfacePrivate: 0,
    surfacePro: 0,
    selectedWorkTypes: [],
    siteAddress: '',
    contractorName: '',
    contractorVat: '',
    contractorAddress: '',
    lineItems: [],
    deliveryDate: ''
  });

  const t = TRANSLATIONS[state.language];

  // Permutateur de langue
  const setLanguage = (lang: 'FR' | 'NL') => {
    setState(prev => ({ ...prev, language: lang }));
  };

  // Simulation Validation VIES
  const handleViesCheck = () => {
    if (state.vatNumber.trim().length > 6) {
      setState(prev => ({ ...prev, isViesValidated: true }));
    } else {
      alert(t.viesError);
    }
  };

  // Basculer la sélection des travaux à l'Étape 2
  const toggleWorkType = (id: any) => {
    setState(prev => {
      const exists = prev.selectedWorkTypes.includes(id);
      const updated = exists 
        ? prev.selectedWorkTypes.filter(item => item !== id)
        : [...prev.selectedWorkTypes, id];
      return { ...prev, selectedWorkTypes: updated };
    });
  };

  // Calcul du moteur fiscal & Synchronisation des lignes du Devis
  const processFiscalEngine = () => {
    const result = calculateVatRules(state);
    
    // Génération automatique des lignes héritées de l'Étape 2
    const generatedItems: LineItem[] = result.rates.map((r, index) => ({
      id: `line-${index}-${Date.now()}`,
      workTypeId: r.workTypeId,
      description: r.label,
      vatRate: r.rate,
      quantity: 1,
      unitPrice: 0.00
    }));

    setState(prev => ({ ...prev, lineItems: generatedItems }));
    setActiveStep(3);
  };

  // Mise à jour d'une ligne du Devis/Facture (Seules Quantité et Prix unitaire sont modifiables)
  const updateLineItem = (id: string, field: 'quantity' | 'unitPrice', value: number) => {
    setState(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  // Ajouter une ligne libre au Devis
  const addCustomLine = () => {
    const newItem: LineItem = {
      id: `custom-${Date.now()}`,
      description: '',
      vatRate: state.clientType === 'B2B' ? 0 : 21,
      quantity: 1,
      unitPrice: 0.00
    };
    setState(prev => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  // Calculs financiers
  const vatResult = calculateVatRules(state);
  const subtotalExcl = state.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalVat = state.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const totalIncl = subtotalExcl + totalVat;

  const totalBuildingSurface = state.surfacePrivate + state.surfacePro;
  const isMixedUsageInvalid = state.buildingUsage === 'MIXED' && totalBuildingSurface < 200;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* En-tête principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">{t.appTitle}</h1>
            <p className="text-xs text-slate-500 mt-1">{t.appSubTitle}</p>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold mr-2 px-2 text-slate-600">Taal / Langue :</span>
            <button
              onClick={() => setLanguage('FR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${state.language === 'FR' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-black'}`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('NL')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${state.language === 'NL' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-black'}`}
            >
              NL
            </button>
          </div>
        </div>

        {/* Barre de navigation / Étapes */}
        <div className="flex overflow-x-auto bg-slate-100 border-b border-slate-200 p-2 gap-2 text-xs font-medium">
          <button onClick={() => setActiveStep(1)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeStep === 1 ? 'bg-blue-600 text-white font-bold shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>{t.step1}</button>
          <button onClick={() => setActiveStep(2)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeStep === 2 ? 'bg-blue-600 text-white font-bold shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>{t.step2}</button>
          <button onClick={() => setActiveStep(3)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeStep === 3 ? 'bg-blue-600 text-white font-bold shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>{t.step3}</button>
          <button onClick={() => setActiveStep(4)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeStep === 4 ? 'bg-blue-600 text-white font-bold shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>📄 {t.screenQuote}</button>
          <button onClick={() => setActiveStep(5)} className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${activeStep === 5 ? 'bg-blue-600 text-white font-bold shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}>📑 {t.screenInvoice}</button>
        </div>

        <div className="p-6">
          
          {/* ÉTAPE 1 : PROFIL CLIENT */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">{t.step1Title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.clientCountry}</label>
                  <select
                    value={state.countryCode}
                    onChange={e => setState({ ...state, countryCode: e.target.value })}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {EU_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {state.language === 'NL' ? c.nameNL : c.nameFR} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.clientStatus}</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="clientType"
                        checked={state.clientType === 'B2C'}
                        onChange={() => setState({ ...state, clientType: 'B2C' })}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      {t.b2c}
                    </label>
                    <label className="flex items-center text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="clientType"
                        checked={state.clientType === 'B2B'}
                        onChange={() => setState({ ...state, clientType: 'B2B' })}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      {t.b2b}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.clientName}</label>
                  <input
                    type="text"
                    value={state.clientName}
                    onChange={e => setState({ ...state, clientName: e.target.value })}
                    placeholder="Nom / Bedrijf..."
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {state.clientType === 'B2B' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.vatNumber}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={state.vatNumber}
                        onChange={e => setState({ ...state, vatNumber: e.target.value, isViesValidated: false })}
                        placeholder="BE 0123.456.789"
                        className="flex-1 p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={handleViesCheck}
                        className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition"
                      >
                        {t.viesBtn}
                      </button>
                    </div>
                    {state.isViesValidated && (
                      <p className="text-xs text-green-600 font-bold mt-2">{t.viesSuccess}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  disabled={state.clientType === 'B2B' && !state.isViesValidated}
                  onClick={() => setActiveStep(2)}
                  className={`px-6 py-2.5 text-xs font-bold text-white rounded-lg transition ${
                    state.clientType === 'B2B' && !state.isViesValidated
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {t.nextStep}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : BIEN IMMOBILIER & TRAVAUX */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">{t.step2Title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.buildingAge}</label>
                  <select
                    value={state.buildingAge}
                    onChange={e => setState({ ...state, buildingAge: e.target.value as any })}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="UNDER_10">{t.under10}</option>
                    <option value="OVER_EQUAL_10">{t.over10}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.buildingUsage}</label>
                  <select
                    value={state.buildingUsage}
                    onChange={e => setState({ ...state, buildingUsage: e.target.value as any })}
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="100_PRIVATE">{t.usage100Private}</option>
                    <option value="OVER_50_PRIVATE">{t.usageOver50Private}</option>
                    <option value="EXCLUSIVE_PRO">{t.usageExclusivePro}</option>
                    <option value="MIXED">{t.usageMixed}</option>
                  </select>
                </div>
              </div>

              {/* Formulaire spécifique Usage Mixte */}
              {state.buildingUsage === 'MIXED' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
                  <p className="text-xs text-amber-800 font-medium">⚠️ {t.mixedWarning}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.surfacePrivateLabel}</label>
                      <input
                        type="number"
                        value={state.surfacePrivate || ''}
                        onChange={e => setState({ ...state, surfacePrivate: Number(e.target.value) })}
                        placeholder="Ex: 120"
                        className="w-full p-2 text-sm border border-slate-300 rounded-md outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.surfaceProLabel}</label>
                      <input
                        type="number"
                        value={state.surfacePro || ''}
                        onChange={e => setState({ ...state, surfacePro: Number(e.target.value) })}
                        placeholder="Ex: 90"
                        className="w-full p-2 text-sm border border-slate-300 rounded-md outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    Surface totale construite : {totalBuildingSurface} m² 
                    {isMixedUsageInvalid && <span className="text-red-600 font-bold ml-2">(< 200 m² requise)</span>}
                  </p>
                </div>
              )}

              {/* Sélection des Travaux */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">{t.natureWorks}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-4 border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
                  {WORK_CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-start text-xs p-2 rounded hover:bg-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.selectedWorkTypes.includes(cat.id)}
                        onChange={() => toggleWorkType(cat.id)}
                        className="mt-0.5 mr-2 h-4 w-4 text-blue-600 rounded"
                      />
                      <span>{state.language === 'NL' ? cat.labelNL : cat.labelFR}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Adresse du chantier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.siteAddress}</label>
                <input
                  type="text"
                  value={state.siteAddress}
                  onChange={e => setState({ ...state, siteAddress: e.target.value })}
                  placeholder={t.siteAddressPlaceholder}
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300"
                >
                  {t.backBtn}
                </button>
                <button
                  disabled={state.selectedWorkTypes.length === 0}
                  onClick={processFiscalEngine}
                  className={`px-6 py-2.5 text-xs font-bold text-white rounded-lg transition ${
                    state.selectedWorkTypes.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {t.calculateVat}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : RESULTAT FISCAL */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">{t.step3Title}</h2>

              {isMixedUsageInvalid && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                  ❌ Attention : La surface totale construite du bâtiment est inférieure à 200 m². L'application applique le régime par défaut selon les règles fiscales.
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.verdictSummary}</h3>
                <ul className="space-y-2">
                  {vatResult.rates.map((r, i) => (
                    <li key={i} className="flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-200">
                      <span className="font-medium text-slate-800">{r.label}</span>
                      <span className="font-extrabold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">{r.rate}% TVA</span>
                    </li>
                  ))}
                </ul>
              </div>

              {vatResult.legalNotice && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-bold text-blue-900 mb-1">{t.legalMentionHeader}</p>
                  <p className="text-xs italic text-blue-800">{vatResult.legalNotice}</p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300"
                >
                  {t.backBtn}
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition"
                >
                  {t.generateQuote}
                </button>
              </div>
            </div>
          )}

          {/* ÉCRAN DEVIS & FACTURE (ÉTAPES 4 ET 5) */}
          {(activeStep === 4 || activeStep === 5) && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  {activeStep === 4 ? `${t.quoteTitle} N° DEV-2026-001` : `${t.invoiceTitle} N° FACT-2026-001`}
                </h2>
                <span className="text-xs text-slate-500 font-mono">Date : {new Date().toLocaleDateString()}</span>
              </div>

              {/* Prestataire et Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold text-slate-600 uppercase">{t.contractorSection}</h3>
                  <input
                    type="text"
                    value={state.contractorName}
                    onChange={e => setState({ ...state, contractorName: e.target.value })}
                    placeholder={t.contractorName}
                    className="w-full p-1.5 text-xs border border-slate-300 rounded outline-none"
                  />
                  <input
                    type="text"
                    value={state.contractorVat}
                    onChange={e => setState({ ...state, contractorVat: e.target.value })}
                    placeholder={t.contractorVat}
                    className="w-full p-1.5 text-xs border border-slate-300 rounded outline-none"
                  />
                  <input
                    type="text"
                    value={state.contractorAddress}
                    onChange={e => setState({ ...state, contractorAddress: e.target.value })}
                    placeholder={t.contractorAddress}
                    className="w-full p-1.5 text-xs border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                  <h3 className="text-xs font-bold text-slate-600 uppercase mb-2">{t.clientSection}</h3>
                  <p><span className="font-bold">Nom :</span> {state.clientName || '-'}</p>
                  <p><span className="font-bold">N° TVA :</span> {state.vatNumber || '-'}</p>
                  <p><span className="font-bold">Adresse chantier :</span> {state.siteAddress || '-'}</p>
                  
                  {activeStep === 5 && (
                    <div className="mt-3 pt-2 border-t border-slate-200">
                      <label className="block text-xs font-bold text-blue-900 mb-1">{t.deliveryDate}</label>
                      <input
                        type="date"
                        value={state.deliveryDate}
                        onChange={e => setState({ ...state, deliveryDate: e.target.value })}
                        className="w-full p-1.5 text-xs border border-blue-300 bg-white rounded outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Tableau des Prestations */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                      <th className="p-2.5">{t.description}</th>
                      <th className="p-2.5 w-20 text-center">{t.qty}</th>
                      <th className="p-2.5 w-28 text-right">{t.unitPrice}</th>
                      <th className="p-2.5 w-20 text-center">{t.vatRate}</th>
                      <th className="p-2.5 w-28 text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.lineItems.map(item => (
                      <tr key={item.id} className="border-b border-slate-200">
                        <td className="p-2.5 font-medium text-slate-800">{item.description}</td>
                        <td className="p-2.5 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                            className="w-14 p-1 text-center border border-slate-300 rounded outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={e => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="w-24 p-1 text-right border border-slate-300 rounded outline-none"
                          />
                        </td>
                        <td className="p-2.5 text-center font-bold">{item.vatRate}%</td>
                        <td className="p-2.5 text-right font-bold">{(item.quantity * item.unitPrice).toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeStep === 4 && (
                <button
                  onClick={addCustomLine}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  {t.addLine}
                </button>
              )}

              {/* Sous-totaux */}
              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-slate-600">{t.subtotalExcl}</span>
                    <span className="font-bold">{subtotalExcl.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between py-1 border-b text-blue-600">
                    <span className="font-medium">{t.vatAmount}</span>
                    <span className="font-bold">{totalVat.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm font-extrabold text-slate-900 border-b-2 border-slate-900">
                    <span>{t.totalIncl}</span>
                    <span>{totalIncl.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Mention Légale Obligatoire */}
              <div className="p-3 bg-slate-100 rounded border border-slate-200 text-xs">
                <p className="font-bold text-slate-700 mb-1">{t.legalMentionHeader}</p>
                <p className="italic text-slate-600">{vatResult.legalNotice || '-'}</p>
              </div>

              {/* Boutons d'Action */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300"
                >
                  {t.backBtn}
                </button>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300">
                    {t.saveQuote}
                  </button>
                  <button className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg hover:bg-slate-900">
                    🖨️ {t.printPdf}
                  </button>
                  {activeStep === 4 && (
                    <button
                      onClick={() => setActiveStep(5)}
                      className="px-4 py-2 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow"
                    >
                      {t.convertToInvoice}
                    </button>
                  )}
                  {activeStep === 5 && (
                    <button className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow">
                      {t.sendPeppol}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
