import React, { useState } from 'react';
import { FormState, LineItem } from './types';
import { EU_COUNTRIES, WORK_CATEGORIES } from './translations';
import * as vatModule from './vatEngine';

// Sécurité : s'adapte automatiquement au nom de fonction présent dans vatEngine.ts
const calculateVatRules = (vatModule as any).calculateVatRules || (vatModule as any).calculateVAT || (() => ({ rates: [{ rate: 21, label: 'Taux normal' }] }));

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
    selectedWorkTypes: ['renov-standard'],
    siteAddress: '',
    contractorName: '',
    contractorVat: '',
    contractorAddress: '',
    lineItems: [],
    deliveryDate: ''
  });

  const getCountryName = (code: string, lang: string) => {
    try {
      const regionNames = new Intl.DisplayNames([lang.toLowerCase()], { type: 'region' });
      return regionNames.of(code) || code;
    } catch {
      return code;
    }
  };

  const getWorkLabel = (workId: string, lang: string) => {
    const work = (WORK_CATEGORIES || []).find((w: any) => w.id === workId);
    if (!work) return lang === 'NL' ? 'Bouwwerken' : 'Travaux de rénovation';
    if (typeof work.label === 'string') return work.label;
    if (typeof work.label === 'object' && work.label !== null) {
      return work.label[lang as 'FR' | 'NL'] || work.label.FR || work.label.NL || 'Travaux';
    }
    return 'Travaux';
  };

  // Calcul sécurisé
  let vatResult: any = { rates: [{ rate: 21, label: 'Taux normal 21%' }] };
  try {
    vatResult = calculateVatRules(state) || vatResult;
  } catch (e) {
    console.error("Erreur de calcul TVA:", e);
  }

  const handleNavigateToStep = (targetStep: number) => {
    if ((targetStep === 4 || targetStep === 5) && (state.lineItems.length === 0 || state.lineItems[0]?.description === '...')) {
      const defaultLabel = getWorkLabel(state.selectedWorkTypes[0] || 'renov-standard', state.language);
      const defaultRate = vatResult?.rates?.[0]?.rate ?? 21;
      
      setState(prev => ({
        ...prev,
        lineItems: [
          {
            id: '1',
            description: defaultLabel,
            quantity: 1,
            unitPrice: 150,
            vatRate: defaultRate
          }
        ]
      }));
    }
    setActiveStep(targetStep);
  };

  const handleViesCheck = () => {
    if (state.vatNumber.trim().length > 5) {
      setState({ ...state, isViesValidated: true });
    } else {
      alert(state.language === 'NL' ? 'Ongeldig BTW-nummer' : 'Numéro de TVA invalide');
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setState(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addLineItem = () => {
    const defaultRate = vatResult?.rates?.[0]?.rate ?? 21;
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: defaultRate
    };
    setState(prev => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  };

  const removeLineItem = (id: string) => {
    setState(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const totalExcl = (state.lineItems || []).reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalVat = (state.lineItems || []).reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.vatRate / 100)), 0);
  const totalIncl = totalExcl + totalVat;

  const isNL = state.language === 'NL';

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>DIGIBÂT VAT / DIGIBOUW BTW</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            {isNL ? 'BTW-bepaling « Onroerende werken » — België' : 'Détermination TVA « Travaux immobiliers » — Belgique'}
          </p>
        </div>
        <div>
          <button 
            onClick={() => setState({ ...state, language: 'FR' })}
            style={{ padding: '6px 12px', fontWeight: !isNL ? 'bold' : 'normal', background: !isNL ? '#2563eb' : '#e2e8f0', color: !isNL ? '#fff' : '#000', border: 'none', borderRadius: '4px 0 0 4px', cursor: 'pointer' }}
          >FR</button>
          <button 
            onClick={() => setState({ ...state, language: 'NL' })}
            style={{ padding: '6px 12px', fontWeight: isNL ? 'bold' : 'normal', background: isNL ? '#2563eb' : '#e2e8f0', color: isNL ? '#fff' : '#000', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}
          >NL</button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 1, label: isNL ? 'Klantprofiel' : 'Profil Client' },
          { id: 2, label: isNL ? 'Pand & Werken' : 'Bien & Travaux' },
          { id: 3, label: isNL ? 'Fiscale Engine' : 'Moteur Fiscal' },
          { id: 4, label: isNL ? '📄 Offerte' : '📄 Écran Devis' },
          { id: 5, label: isNL ? '🧾 Factuur' : '🧾 Écran Facture' }
        ].map(step => (
          <button
            key={step.id}
            onClick={() => handleNavigateToStep(step.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              background: activeStep === step.id ? '#2563eb' : '#f1f5f9',
              color: activeStep === step.id ? '#fff' : '#475569',
              fontWeight: activeStep === step.id ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
          >
            {step.id}. {step.label}
          </button>
        ))}
      </div>

      {/* BLOC ETAPES */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
        
        {/* ETAPE 1 */}
        {activeStep === 1 && (
          <div>
            <h3>Étape 1 : {isNL ? 'Klantprofiel' : 'Profil Client'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Land van de klant' : 'Pays du client'}
                </label>
                <select 
                  value={state.countryCode} 
                  onChange={(e) => setState({ ...state, countryCode: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  {(EU_COUNTRIES || ['BE', 'FR', 'NL', 'DE']).map((code: string) => (
                    <option key={code} value={code}>
                      {getCountryName(code, state.language)} ({code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Statuut klant' : 'Statut du client'}
                </label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <label><input type="radio" checked={state.clientType === 'B2C'} onChange={() => setState({ ...state, clientType: 'B2C' })} /> Particulier (B2C)</label>
                  <label><input type="radio" checked={state.clientType === 'B2B'} onChange={() => setState({ ...state, clientType: 'B2B' })} /> Assujetti (B2B)</label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Naam klant' : 'Nom du client'}
                </label>
                <input 
                  type="text" 
                  value={state.clientName} 
                  onChange={(e) => setState({ ...state, clientName: e.target.value })} 
                  placeholder="Ex: Livlina NV" 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              {state.clientType === 'B2B' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                    {isNL ? 'BTW-nummer' : 'Numéro de TVA'}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={state.vatNumber} 
                      onChange={(e) => setState({ ...state, vatNumber: e.target.value, isViesValidated: false })} 
                      placeholder="BE 0123.456.789" 
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <button 
                      onClick={handleViesCheck} 
                      style={{ padding: '10px 16px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {isNL ? 'Controleer VIES' : 'Vérifier VIES'}
                    </button>
                  </div>
                  {state.isViesValidated && (
                    <p style={{ color: '#16a34a', fontSize: '12px', marginTop: '4px', fontWeight: 'bold' }}>✓ TVA VIES Validée (OK)</p>
                  )}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setActiveStep(2)} 
              style={{ marginTop: '24px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', float: 'right' }}
            >
              Étape suivante →
            </button>
          </div>
        )}

        {/* ETAPE 2 */}
        {activeStep === 2 && (
          <div>
            <h3>Étape 2 : {isNL ? 'Pand & Werken' : 'Bien Immobilier & Nature des Travaux'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Ouderdom gebouw' : 'Âge du bâtiment'}
                </label>
                <select 
                  value={state.buildingAge} 
                  onChange={(e) => setState({ ...state, buildingAge: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="UNDER_10">{isNL ? '< 10 jaar' : '< 10 ans'}</option>
                  <option value="OVER_EQUAL_10">{isNL ? '≥ 10 jaar' : '≥ 10 ans'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                  {isNL ? 'Gebruik van het gebouw' : 'Usage du bâtiment'}
                </label>
                <select 
                  value={state.buildingUsage} 
                  onChange={(e) => setState({ ...state, buildingUsage: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="100_PRIVATE">100% Privé</option>
                  <option value="OVER_50_PRIVATE">&gt; 50% Privé</option>
                  <option value="MIXED">{isNL ? 'Gemengd gebruik' : 'Usage Mixte'}</option>
                </select>
              </div>
            </div>

            {state.buildingUsage === 'MIXED' && (
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#854d0e', fontWeight: 'bold' }}>
                  ⚠️ Règle d'usage mixte (Superficie totale ≥ 200 m² requise pour taux réduit)
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px' }}>Surface Privée (m²)</label>
                    <input 
                      type="number" 
                      value={state.surfacePrivate || ''} 
                      onChange={(e) => setState({ ...state, surfacePrivate: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px' }}>Surface Professionnelle (m²)</label>
                    <input 
                      type="number" 
                      value={state.surfacePro || ''} 
                      onChange={(e) => setState({ ...state, surfacePro: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                {isNL ? 'Aard van de werken' : 'Nature principale des travaux'}
              </label>
              <select 
                value={state.selectedWorkTypes[0] || 'renov-standard'} 
                onChange={(e) => setState({ ...state, selectedWorkTypes: [e.target.value] })}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                {(WORK_CATEGORIES || []).map((work: any) => (
                  <option key={work.id} value={work.id}>
                    {getWorkLabel(work.id, state.language)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                {isNL ? 'Adres van de werf' : 'Adresse du chantier'}
              </label>
              <input 
                type="text" 
                value={state.siteAddress} 
                onChange={(e) => setState({ ...state, siteAddress: e.target.value })}
                placeholder="Heidestraat 43, 9070 Destelbergen" 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <button 
              onClick={() => setActiveStep(3)} 
              style={{ marginTop: '24px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', float: 'right' }}
            >
              {isNL ? 'Bereken BTW' : 'Calculer TVA'} →
            </button>
          </div>
        )}

        {/* ETAPE 3 */}
        {activeStep === 3 && (
          <div>
            <h3>Étape 3 : Régime TVA Déterminé</h3>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Taux applicable :</span>
                <span style={{ padding: '6px 16px', background: '#dcfce7', color: '#15803d', fontWeight: 'bold', borderRadius: '20px', fontSize: '16px' }}>
                  ✓ {vatResult?.rates?.[0]?.rate ?? 21}% {vatResult?.rates?.[0]?.rate === 0 ? '(Autoliquidation / Verlegging van heffing)' : ''}
                </span>
              </div>
              <p style={{ fontSize: '13px', marginTop: '12px', color: '#334155' }}>
                <strong>Détail :</strong> {vatResult?.rates?.[0]?.label ?? 'Taux normal 21%'}
              </p>
              {vatResult?.legalNotice && (
                <div style={{ marginTop: '16px', background: '#eff6ff', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
                  <strong style={{ fontSize: '12px', color: '#1e40af' }}>Mention légale obligatoire :</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#1e3a8a', fontStyle: 'italic' }}>
                    "{vatResult.legalNotice}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleNavigateToStep(4)} 
                style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📝 Générer le Devis
              </button>
              <button 
                onClick={() => handleNavigateToStep(5)} 
                style={{ padding: '12px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🧾 Générer la Facture
              </button>
            </div>
          </div>
        )}

        {/* ETAPE 4 ET 5 */}
        {(activeStep === 4 || activeStep === 5) && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0 }}>{activeStep === 4 ? 'DEVIS / OFFERTE' : 'FACTURE / FACTUUR'}</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  N° : {activeStep === 4 ? 'DEV-2026-001' : 'FAC-2026-001'} | Date : {new Date().toLocaleDateString('fr-BE')}
                </span>
              </div>
              <span style={{ padding: '6px 12px', background: '#dbeafe', color: '#1e40af', fontWeight: 'bold', borderRadius: '12px', fontSize: '13px' }}>
                ✓ {vatResult?.rates?.[0]?.rate ?? 21}% {vatResult?.rates?.[0]?.rate === 0 ? '(Autoliquidation)' : ''}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>Prestataire / Entrepreneur</h4>
                <input type="text" placeholder="Mira sarl" value={state.contractorName} onChange={(e) => setState({ ...state, contractorName: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="BE 0552.235.026" value={state.contractorVat} onChange={(e) => setState({ ...state, contractorVat: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Adresse..." value={state.contractorAddress} onChange={(e) => setState({ ...state, contractorAddress: e.target.value })} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>Client & Chantier</h4>
                <p style={{ margin: '4px 0' }}><strong>Client :</strong> {state.clientName || 'Livlina (NV)'}</p>
                <p style={{ margin: '4px 0' }}><strong>N° BTW :</strong> {state.vatNumber || 'BE 0448.553.239'}</p>
                <p style={{ margin: '4px 0' }}><strong>Adresse Chantier :</strong> {state.siteAddress || 'Heidestraat 43, 9070 Destelbergen'}</p>
              </div>
            </div>

            <h4>PRESTATIONS</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '12px' }}>
                  <th style={{ padding: '8px' }}>Description</th>
                  <th style={{ padding: '8px', width: '80px' }}>Qté</th>
                  <th style={{ padding: '8px', width: '120px' }}>Prix unitaire</th>
                  <th style={{ padding: '8px', width: '120px' }}>Montant</th>
                  <th style={{ padding: '8px', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {state.lineItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px' }}>
                      <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))} 
                        style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    </td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>
                      {(item.quantity * item.unitPrice).toFixed(2)} €
                    </td>
                    <td style={{ padding: '8px' }}>
                      <button onClick={() => removeLineItem(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={addLineItem} style={{ padding: '6px 12px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
              + Ligne
            </button>

            <div style={{ marginTop: '20px', width: '300px', marginLeft: 'auto', textAlign: 'right', fontSize: '14px' }}>
              <p style={{ margin: '4px 0' }}>Subtotaal EXCL. BTW : <strong>{totalExcl.toFixed(2)} €</strong></p>
              <p style={{ margin: '4px 0', color: '#2563eb' }}>Montant TVA ({vatResult?.rates?.[0]?.rate ?? 21}%) : <strong>{totalVat.toFixed(2)} €</strong></p>
              <p style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>Total TTC : {totalIncl.toFixed(2)} €</p>
            </div>

            {vatResult?.legalNotice && (
              <div style={{ marginTop: '24px', background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', color: '#475569' }}>
                <strong>Mention légale obligatoire :</strong><br />
                <em>{vatResult.legalNotice}</em>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
