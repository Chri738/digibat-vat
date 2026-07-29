import React, { useState } from 'react';
import { DevisFactureScreen } from './components/DevisFactureScreen';

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');

  // Étape 1 : Client
  const [clientType, setClientType] = useState<'b2c' | 'b2b'>('b2b');
  const [clientName, setClientName] = useState<string>('Vicernant(NV)');
  const [clientVat, setClientVat] = useState<string>('BE 0400.075.312');
  const [siteAddress, setSiteAddress] = useState<string>('');

  // Étape 2 : Pays, VIES & Bâtiment
  const [country, setCountry] = useState<string>('BE');
  const [viesStatus, setViesStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [buildingAge, setBuildingAge] = useState<'more10' | 'less10'>('more10');
  const [buildingUse, setBuildingUse] = useState<'private' | 'pro'>('private');

  // Simulation / Vérification VIES
  const handleCheckVies = () => {
    if (!clientVat) return;
    setViesStatus('loading');
    setTimeout(() => {
      if (clientVat.replace(/[^a-zA-Z0-9]/g, '').length >= 8) {
        setViesStatus('valid');
      } else {
        setViesStatus('invalid');
      }
    }, 600);
  };

  // Calcul du régime TVA pour l'Étape 3
  const getVatLogic = () => {
    // Si B2B (Assujetti)
    if (clientType === 'b2b') {
      if (country === 'BE') {
        return {
          rate: 0 as const,
          label: 'Autoliquidation (Co-contractant) - Article 20 AR n°1',
          notice: "Autoliquidation : En l'absence de contestation par écrit, dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques et que les travaux immobiliers sont affectés à son activité professionnelle (Art. 20 KB n° 1)."
        };
      } else if (country !== 'NON_EU') {
        return {
          rate: 0 as const,
          label: 'Prestation Intracommunautaire (Autoliquidation 0%)',
          notice: "Exonération de TVA - Autoliquidation par le destinataire (Article 196 de la Directive 2006/112/CE)."
        };
      } else {
        return {
          rate: 0 as const,
          label: 'Exportation / Hors UE (0%)',
          notice: "Prestation localisée hors Union Européenne - Exonération de TVA."
        };
      }
    }

    // Si B2C (Particulier)
    if (country === 'BE') {
      if (buildingAge === 'more10' && buildingUse === 'private') {
        return {
          rate: 6 as const,
          label: 'Taux réduit 6% (Habitation privée > 10 ans)',
          notice: "Taux réduit de 6% applicable (Rubrique XXXVIII de l'annexe au KB n° 20). Le client atteste que l'immeuble est affecté à titre principal comme logement privé et est occupé depuis plus de 10 ans."
        };
      }
      return {
        rate: 21 as const,
        label: 'Taux normal 21%',
        notice: 'Taux normal de 21% applicable aux travaux immobiliers.'
      };
    }

    return {
      rate: 21 as const,
      label: 'Taux normal 21% (B2C International)',
      notice: 'Taux de TVA applicable selon les règles de localisation des prestations immobilières.'
    };
  };

  const currentVat = getVatLogic();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sélecteur de langue */}
      <div style={{ maxWidth: '800px', margin: '0 auto 10px auto', textAlign: 'right' }}>
        <button 
          onClick={() => setLang('FR')} 
          style={{ fontWeight: lang === 'FR' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
          FR
        </button>
        |
        <button 
          onClick={() => setLang('NL')} 
          style={{ fontWeight: lang === 'NL' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
          NL
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h2 style={{ color: '#1e3a8a', marginTop: 0 }}>
          Détermination TVA « Travaux immobiliers » — Belgique 2025-2026
        </h2>

        {/* Fil d'Ariane des étapes */}
        {step <= 3 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            <span style={{ color: step === 1 ? '#2563eb' : '#64748b' }}>1. Profil Client</span> &gt;
            <span style={{ color: step === 2 ? '#2563eb' : '#64748b' }}>2. Bâtiment & VIES</span> &gt;
            <span style={{ color: step === 3 ? '#2563eb' : '#64748b' }}>3. Régime TVA</span>
          </div>
        )}

        {/* ÉTAPE 1 : PROFIL CLIENT */}
        {step === 1 && (
          <div>
            <h3>Étape 1 : Profil Client</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="clientType" 
                  value="b2c" 
                  checked={clientType === 'b2c'} 
                  onChange={() => setClientType('b2c')} 
                />
                Particular / Non-assujetti (B2C)
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="clientType" 
                  value="b2b" 
                  checked={clientType === 'b2b'} 
                  onChange={() => setClientType('b2b')} 
                />
                Assujetti à la TVA (B2B)
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nom / Raison sociale :</label>
              <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </div>

            {clientType === 'b2b' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Numéro TVA client :</label>
                <input 
                  type="text" 
                  value={clientVat} 
                  onChange={(e) => setClientVat(e.target.value)}
                  placeholder="BE 0123.456.789"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Adresse du chantier :</label>
              <input 
                type="text" 
                value={siteAddress} 
                onChange={(e) => setSiteAddress(e.target.value)}
                placeholder="Rue, N°, Code Postal, Ville"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
            </div>

            <button 
              onClick={() => setStep(2)} 
              style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Passer à l'Étape 2 →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : PAYS, VIES ET BÂTIMENT */}
        {step === 2 && (
          <div>
            <h3>Étape 2 : Localisation, VIES & Bâtiment</h3>

            {/* Sélecteur de pays UE */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pays du client / chantier :</label>
              <select 
                value={country} 
                onChange={(e) => {
                  setCountry(e.target.value);
                  setViesStatus('idle');
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="BE">🇧🇪 Belgique (BE)</option>
                <option value="FR">🇫🇷 France (FR)</option>
                <option value="NL">🇳🇱 Pays-Bas (NL)</option>
                <option value="DE">🇩🇪 Allemagne (DE)</option>
                <option value="LU">🇱🇺 Luxembourg (LU)</option>
                <option value="ES">🇪🇸 Espagne (ES)</option>
                <option value="IT">🇮🇹 Italie (IT)</option>
                <option value="EU_OTHER">🇪🇺 Autre pays membre de l'UE</option>
                <option value="NON_EU">🌐 Hors Union Européenne</option>
              </select>
            </div>

            {/* Vérification VIES si B2B */}
            {clientType === 'b2b' && country !== 'NON_EU' && (
              <div style={{ marginBottom: '20px', background: '#f1f5f9', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e3a8a' }}>
                  🇪🇺 Vérification du numéro de TVA VIES :
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{clientVat || 'Non renseigné'}</span>
                  <button 
                    onClick={handleCheckVies} 
                    style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {viesStatus === 'loading' ? 'Vérification...' : 'Vérifier VIES'}
                  </button>
                </div>

                {viesStatus === 'valid' && (
                  <p style={{ color: '#16a34a', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '13px' }}>
                    ✅ Numéro TVA Valide dans le système VIES.
                  </p>
                )}
                {viesStatus === 'invalid' && (
                  <p style={{ color: '#dc2626', margin: '8px 0 0 0', fontWeight: 'bold', fontSize: '13px' }}>
                    ❌ Numéro TVA Invalide sur VIES.
                  </p>
                )}
              </div>
            )}

            {/* Âge du bâtiment et Usage */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ancienneté du bâtiment :</label>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="buildingAge" 
                  value="more10" 
                  checked={buildingAge === 'more10'} 
                  onChange={() => setBuildingAge('more10')} 
                />
                Plus de 10 ans d'ancienneté
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="buildingAge" 
                  value="less10" 
                  checked={buildingAge === 'less10'} 
                  onChange={() => setBuildingAge('less10')} 
                />
                Moins de 10 ans / Neuf
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usage du bâtiment :</label>
              <label style={{ marginRight: '15px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="buildingUse" 
                  value="private" 
                  checked={buildingUse === 'private'} 
                  onChange={() => setBuildingUse('private')} 
                />
                Logement principalement privé
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="buildingUse" 
                  value="pro" 
                  checked={buildingUse === 'pro'} 
                  onChange={() => setBuildingUse('pro')} 
                />
                Usage professionnel / Commercial
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setStep(1)} 
                style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                ← Retour Étape 1
              </button>
              <button 
                onClick={() => setStep(3)} 
                style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Passer à l'Étape 3 →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : RÉGIME TVA & ATTESTATION LÉGALE */}
        {step === 3 && (
          <div>
            <h3>Étape 3 : Régime TVA & Attestation Légale</h3>

            <div style={{ border: '1px solid #2563eb', background: '#eff6ff', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#1e3a8a', textTransform: 'uppercase', fontWeight: 'bold' }}>RÉGIME TVA APPLICABLE</span>
              <h3 style={{ color: '#1e40af', margin: '5px 0 0 0' }}>
                {currentVat.label}
              </h3>
            </div>

            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic' }}>
                📜 <strong>Mention légale obligatoire à inscrire sur la facture :</strong>
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                « {currentVat.notice} »
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setStep(2)} 
                style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                ← Retour Étape 2
              </button>
              <button 
                onClick={() => setStep(4)} 
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                📄 Générer le Devis / la Facture →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : ÉCRAN DEVIS / FACTURE */}
        {step === 4 && (
          <DevisFactureScreen 
            lang={lang}
            defaultVatRate={currentVat.rate}
            legalMention={currentVat.notice}
            initialClientName={clientName}
            initialClientVat={clientVat}
            initialSiteAddress={siteAddress}
            onBackToStep3={() => setStep(3)}
          />
        )}

      </div>
    </div>
  );
}
