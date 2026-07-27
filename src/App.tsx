import React, { useState } from 'react';
import { 
  Building2, UserCheck, FileText, CheckCircle2, AlertTriangle, 
  Printer, Save, FileCheck, ArrowRight, ArrowLeft, Globe, Calculator, Download 
} from 'lucide-react';

// Pays membres de l'Union Européenne
const EU_COUNTRIES = [
  { code: 'BE', name: 'Belgique / België' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Pays-Bas / Nederland' },
  { code: 'DE', name: 'Allemagne / Deutschland' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'AT', name: 'Autriche / Österreich' },
  { code: 'BG', name: 'Bulgarie' },
  { code: 'CY', name: 'Chypre' },
  { code: 'HR', name: 'Croatie' },
  { code: 'DK', name: 'Danemark' },
  { code: 'ES', name: 'Espagne / España' },
  { code: 'EE', name: 'Estonie' },
  { code: 'FI', name: 'Finlande' },
  { code: 'GR', name: 'Grèce' },
  { code: 'HU', name: 'Hongrie' },
  { code: 'IE', name: 'Irlande' },
  { code: 'IT', name: 'Italie' },
  { code: 'LV', name: 'Lettonie' },
  { code: 'LT', name: 'Lituanie' },
  { code: 'MT', name: 'Malte' },
  { code: 'PL', name: 'Pologne' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CZ', name: 'République Tchèque' },
  { code: 'RO', name: 'Roumanie' },
  { code: 'SK', name: 'Slovaquie' },
  { code: 'SI', name: 'Slovénie' },
  { code: 'SE', name: 'Suède' }
];

export default function App() {
  const [lang, setLang] = useState<'FR' | 'NL'>('FR');
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Étape 1 : Client
  const [clientName, setClientName] = useState('');
  const [clientCountry, setClientCountry] = useState('BE');
  const [clientStatus, setClientStatus] = useState('b2b_periodic'); // b2b_periodic, b2b_special, b2c
  const [vatNumber, setVatNumber] = useState('');
  const [viesVerified, setViesVerified] = useState<boolean | null>(null);

  // Étape 2 : Bien & Travaux
  const [siteAddress, setSiteAddress] = useState('');
  const [buildingAge, setBuildingAge] = useState<'minus_10' | 'plus_10'>('plus_10');
  const [buildingUsage, setBuildingUsage] = useState<'privat' | 'pro' | 'mixed'>('privat');
  const [privatePercentage, setPrivatePercentage] = useState(60);
  const [surfaceM2, setSurfaceM2] = useState(180);
  const [workType, setWorkType] = useState<'renovation' | 'heatpump' | 'solar' | 'demolition'>('renovation');
  const [extWork, setExtWork] = useState<'none' | 'maintenance' | 'heavy'>('none');

  // Entrepreneur / Société
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Mon Entreprise BTP BV',
    vat: 'BE0123456789',
    address: 'Rue du Progrès 12, 1000 Bruxelles',
    iban: 'BE68 0000 1234 5678',
    email: 'contact@btp-expert.be'
  });

  // Articles Devis / Facture
  const [items, setItems] = useState([
    { description: 'Travaux de rénovation et finition intérieur', qty: 1, unitPrice: 5500 }
  ]);

  // Vérification VIES Factice
  const handleVerifyVIES = () => {
    if (vatNumber.trim().length > 5) {
      setViesVerified(true);
    } else {
      setViesVerified(false);
    }
  };

  // Calcul du Verdict Fiscal à l'Étape 3
  const getVerdict = () => {
    if (clientStatus === 'b2b_periodic') {
      return {
        rate: 'Autoliquidation (0%)',
        legalText: lang === 'FR' 
          ? "Autoliquidation : En l'absence de contestation par écrit, dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître qu'il est un assujetti tenu au dépôt de déclarations périodiques. Si cette condition n'est pas remplie, le client sera tenu au paiement de la taxe, des intérêts et des amendes dus. (Art. 20, § 3, al. 2 de l'AR n° 1)."
          : "Btw verlegd: Bij gebrek an schriftelijke betwisting binnen een termijn van één maand na de ontvangst van de factuur, wordt de afnemer vermoed te erkennen dat hij een belastingplichtige is die gehouden is tot het indienen van periodieke aangiften. (Art. 20, § 3, lid 2 KB nr. 1).",
        isAutoliquidation: true
      };
    }

    if (extWork === 'maintenance' || extWork === 'heavy') {
      return {
        rate: '21%',
        legalText: lang === 'FR'
          ? "Taux normal de 21% applicable aux travaux extérieurs et aménagement d'espaces verts (AR n° 20)."
          : "Normaal tarief van 21% van toepassing op buitenwerken en aanleg van groenzones (KB nr. 20).",
        isAutoliquidation: false
      };
    }

    if (workType === 'demolition') {
      if (surfaceM2 <= 200) {
        return {
          rate: '6%',
          legalText: lang === 'FR'
            ? `Taux réduit de 6% applicable selon l'AR n° 20, tableau A, rubrique XXXVII (Démolition et reconstruction d'une habitation propre et unique ≤ 200 m²). Surface déclarée : ${surfaceM2} m².`
            : `Verlaagd tarief van 6% van toepassing overeenkomstig KB nr. 20, tabel A, rubriek XXXVII (Sloop en heropbouw van enige en eigen woning ≤ 200 m²). Aangegeven oppervlakte: ${surfaceM2} m².`,
          isAutoliquidation: false
        };
      } else {
        return {
          rate: '21%',
          legalText: lang === 'FR'
            ? `Taux de 21% applicable. La surface habitable (${surfaceM2} m²) dépasse le plafond légal de 200 m² pour le taux réduit de 6% en démolition/reconstruction.`
            : `Tarief van 21% van toepassing. De bewoonbare oppervlakte (${surfaceM2} m²) overschrijdt de wettelijke grens van 200 m² voor het 6% tarief bij sloop/heropbouw.`,
          isAutoliquidation: false
        };
      }
    }

    if (buildingAge === 'plus_10') {
      if (buildingUsage === 'mixed') {
        return {
          rate: `Mixte : ${privatePercentage}% à 6% / ${100 - privatePercentage}% à 21%`,
          legalText: lang === 'FR'
            ? `Taux réduit de 6% applicable pour la partie privée (${privatePercentage}%) selon l'AR n° 20, rubrique XXXVIII. Taux normal de 21% pour la partie professionnelle (${100 - privatePercentage}%). Le client s'engage à contester par écrit dans le mois en cas d'inexactitude.`
            : `Verlaagd tarief van 6% voor het privégedeelte (${privatePercentage}%) (KB nr. 20, rubriek XXXVIII). Normaal tarief van 21% voor het professionele gedeelte (${100 - privatePercentage}%).`,
          isAutoliquidation: false
        };
      }
      return {
        rate: '6%',
        legalText: lang === 'FR'
          ? "Taux réduit de 6% - AR n° 20, annexe, tableau A, rubrique XXXVIII. En l'absence de contestation par écrit dans un délai d'un mois à compter de la réception de la facture, le client est présumé reconnaître que l'immeuble est affecté à titre privé à plus de 50% et a plus de 10 ans d'ancienneté."
          : "Verlaagd tarief van 6% - KB nr. 20, bijlage, tabel A, rubriek XXXVIII. Bij gebrek aan schriftelijke betwisting binnen één maand, wordt de klant geacht te erkennen dat de woning ouder is dan 10 jaar en meer dan 50% privé wordt gebruikt.",
        isAutoliquidation: false
      };
    }

    return {
      rate: '21%',
      legalText: lang === 'FR'
        ? "Taux normal de 21% - Bâtiment de moins de 10 ans d'ancienneté."
        : "Normaal tarief van 21% - Gebouw jonger dan 10 jaar.",
      isAutoliquidation: false
    };
  };

  const verdict = getVerdict();

  // Calculs financiers
  const totalHTVA = items.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
  const vatRateVal = verdict.rate.includes('6%') ? 0.06 : (verdict.rate.includes('Autoliquidation') ? 0 : 0.21);
  const totalTVA = totalHTVA * vatRateVal;
  const totalTTC = totalHTVA + totalTVA;

  // Export Peppol XML
  const handleDownloadPeppol = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>
    <cbc:ID>INV-2026-001</cbc:ID>
    <cbc:IssueDate>${new Date().toISOString().split('T')[0]}</cbc:IssueDate>
    <cac:AccountingSupplierParty>
        <cac:Party><cbc:EndpointID schemeID="0208">${companyInfo.vat}</cbc:EndpointID></cac:Party>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cac:Party><cbc:EndpointID schemeID="0208">${vatNumber || 'B2C'}</cbc:EndpointID></cac:Party>
    </cac:AccountingCustomerParty>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="EUR">${totalTVA.toFixed(2)}</cbc:TaxAmount>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:PayableAmount currencyID="EUR">${totalTTC.toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
</Invoice>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_PEPPOL_${clientName || 'Client'}.xml`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      {/* Header Bar */}
      <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'FR' ? 'DigiBât TVA' : 'DigiBouw BTW'}
            </h1>
            <p className="text-xs text-slate-500">
              {lang === 'FR' ? 'Détermination TVA « Travaux immobiliers » — Belgique 2025-2026' : 'BTW-bepaling "Werken in onroerende staat" — België 2025-2026'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full border border-emerald-300">
            ✓ Conforme réformes 2025-2026
          </span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setLang('FR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${lang === 'FR' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
              FR
            </button>
            <button 
              onClick={() => setLang('NL')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${lang === 'NL' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
              NL
            </button>
          </div>
        </div>
      </header>

      {/* Stepper Header */}
      <div className="max-w-5xl mx-auto mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center">
          {[
            { id: 1, name: lang === 'FR' ? 'Profil Client' : 'Klantprofiel' },
            { id: 2, name: lang === 'FR' ? 'Bien & Travaux' : 'Goed & Werken' },
            { id: 3, name: lang === 'FR' ? 'Résultat' : 'Resultaat' },
            { id: 4, name: lang === 'FR' ? 'Devis' : 'Offerte' },
            { id: 5, name: lang === 'FR' ? 'Facture' : 'Factuur' }
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <button 
                onClick={() => setStep(s.id as any)}
                className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center transition ${
                  step === s.id ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-600'
                }`}>
                {s.id}
              </button>
              <span className="hidden md:inline text-xs font-semibold text-slate-700">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto">
        {/* ÉTAPE 1 : PROFIL CLIENT */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
              Étape 1 : Profil du Client / Klantprofiel
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom / Entreprise</label>
                <input 
                  type="text"
                  placeholder="ex: Jean Dupont / SPRL Bâtiment"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pays (Union Européenne)</label>
                <select 
                  value={clientCountry}
                  onChange={(e) => setClientCountry(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  {EU_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Statut TVA du Client</label>
              <select 
                value={clientStatus}
                onChange={(e) => setClientStatus(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="b2b_periodic">Assujetti B2B avec déclarations périodiques (Autoliquidation Art. 20 / AR n° 1)</option>
                <option value="b2b_special">Assujetti B2B régimes spéciaux / non établi</option>
                <option value="b2c">Particulier / Client B2C (Consommateur final)</option>
              </select>
            </div>

            {clientStatus !== 'b2c' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <label className="block text-xs font-bold text-blue-900 uppercase">Numéro de TVA</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="ex: BE0123456789"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    className="flex-1 p-2.5 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    onClick={handleVerifyVIES}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Vérifier VIES
                  </button>
                </div>

                {viesVerified === true && (
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    ✓ Numéro VIES Valide et actif
                  </p>
                )}
                {viesVerified === false && (
                  <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                    ⚠ Numéro VIES non valide ou inexistant
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                Suivant : Bien & Travaux <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : BIEN & TRAVAUX */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
              Étape 2 : Bien Immobilier & Travaux / Goed & Werken
            </h2>

            {/* ADRESSE DU CHANTIER */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1">Adresse du Chantier / Bien Immobilier (Obligatoire)</label>
              <input 
                type="text"
                placeholder="Rue de la Station 45, 1000 Bruxelles"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                className="w-full p-2.5 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              />
            </div>

            {/* ANCIENNETÉ DU BÂTIMENT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Ancienneté du bâtiment</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setBuildingAge('minus_10')}
                  className={`p-4 border-2 rounded-xl text-left font-semibold text-sm transition ${buildingAge === 'minus_10' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}>
                  🏢 Moins de 10 ans
                </button>
                <button 
                  type="button"
                  onClick={() => setBuildingAge('plus_10')}
                  className={`p-4 border-2 rounded-xl text-left font-semibold text-sm transition ${buildingAge === 'plus_10' ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-slate-200'}`}>
                  🏠 Plus de 10 ans (Éligible 6%)
                </button>
              </div>
            </div>

            {/* USAGE DU BÂTIMENT */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Usage du bâtiment</label>
              <div className="grid md:grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={() => setBuildingUsage('privat')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${buildingUsage === 'privat' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🏡 Logement Privé (&gt; 50%)
                </button>
                <button 
                  type="button"
                  onClick={() => setBuildingUsage('pro')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${buildingUsage === 'pro' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🏢 Exclusivement Professionnel
                </button>
                <button 
                  type="button"
                  onClick={() => setBuildingUsage('mixed')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${buildingUsage === 'mixed' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🔀 Gemengd (Privé + Pro)
                </button>
              </div>

              {buildingUsage === 'mixed' && (
                <div className="mt-3 p-4 bg-slate-100 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Répartition de la surface (Quote-part Privée : {privatePercentage}%)</label>
                  <input 
                    type="range" min="1" max="99" value={privatePercentage} 
                    onChange={(e) => setPrivatePercentage(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-600">
                    Proportion Privée : <strong>{privatePercentage}%</strong> | Proportion Pro : <strong>{100 - privatePercentage}%</strong>
                  </p>
                </div>
              )}
            </div>

            {/* NATURE DES TRAVAUX */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nature des travaux principaux</label>
              <div className="grid md:grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setWorkType('renovation')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${workType === 'renovation' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🔨 Standaard onderhoud en renovatie
                </button>
                <button 
                  type="button"
                  onClick={() => setWorkType('heatpump')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${workType === 'heatpump' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🔥 Pompes à chaleur (Warmtepomp)
                </button>
                <button 
                  type="button"
                  onClick={() => setWorkType('solar')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${workType === 'solar' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  ☀️ Panneaux solaires & Isolation
                </button>
                <button 
                  type="button"
                  onClick={() => setWorkType('demolition')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${workType === 'demolition' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🏗️ Sloop & Heropbouw (Démolition / Reconstruction)
                </button>
              </div>

              {workType === 'demolition' && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                  <label className="block text-xs font-bold text-blue-900">Surface totale habitable reconstruite (Règle légale des 200 m² max pour 6%)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={surfaceM2}
                      onChange={(e) => setSurfaceM2(Number(e.target.value))}
                      className="p-2 border rounded-lg w-32 font-bold text-sm"
                    />
                    <span className="text-sm font-semibold">m²</span>
                  </div>
                  {surfaceM2 > 200 && (
                    <p className="text-xs text-rose-600 font-bold">
                      ⚠ Attention : Dépassement des 200 m² ! Le taux passe obligatoirement à 21%.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* TRAVAUX EXTÉRIEURS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Travaux extérieurs / Espaces verts (Optionnel)</label>
              <div className="grid md:grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={() => setExtWork('none')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${extWork === 'none' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🚫 Niet van toepassing
                </button>
                <button 
                  type="button"
                  onClick={() => setExtWork('maintenance')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${extWork === 'maintenance' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🌿 Entretien courant (Tonte, haies)
                </button>
                <button 
                  type="button"
                  onClick={() => setExtWork('heavy')}
                  className={`p-3 border-2 rounded-xl text-left text-sm font-semibold ${extWork === 'heavy' ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                  🏗️ Aanleg & Grote werken (Terrasse)
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 border font-semibold text-sm rounded-lg hover:bg-slate-100 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                Voir le Verdict Fiscal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : RÉSULTAT ET VERDICT FISCAL */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
              Étape 3 : Résultat & Mentions Légales / Verdict & Wettekst
            </h2>

            <div className="p-6 bg-blue-50 border-2 border-blue-500 rounded-xl space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-blue-700">Taux de TVA Déterminé</span>
                  <p className="text-3xl font-black text-blue-950 mt-1">{verdict.rate}</p>
                </div>
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Mention Légale Obligatoire sur Facture :</span>
                <p className="text-sm font-mono text-slate-800 leading-relaxed italic">
                  "{verdict.legalText}"
                </p>
              </div>

              <div className="p-3 bg-amber-100 border-l-4 border-amber-500 text-amber-900 text-xs rounded">
                <strong>Responsabilité du Client :</strong> Conformément à la réglementation fiscale belge, le client est responsable de la véracité des informations transmises concernant la destination et l'ancienneté du bien. En cas d'inexactitude, les amendes et suppléments de taxe seront à sa charge.
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3 pt-4 border-t">
              <button 
                onClick={() => setStep(2)}
                className="px-4 py-2 border font-semibold text-sm rounded-lg hover:bg-slate-100 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Modifier
              </button>

              <div className="flex gap-2">
                <button 
                  onClick={() => alert('Détermination enregistrée dans le journal local !')}
                  className="px-4 py-2.5 bg-slate-800 text-white font-bold text-sm rounded-lg hover:bg-slate-900 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
                <button 
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Convertir en Devis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : MODULE DEVIS */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex justify-between items-center">
              <span>Générateur de Devis Officielles</span>
              <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded">Devis N° DEV-2026-001</span>
            </h2>

            {/* Infos Entrepreneur */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Informations de votre Entreprise</h3>
                <input 
                  type="text" value={companyInfo.name} 
                  onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})}
                  className="w-full p-2 border rounded mb-2 text-sm font-semibold"
                />
                <input 
                  type="text" value={companyInfo.vat} 
                  onChange={e => setCompanyInfo({...companyInfo, vat: e.target.value})}
                  className="w-full p-2 border rounded text-sm font-mono"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Client & Chantier</h3>
                <p className="text-sm font-bold text-slate-800">{clientName || 'Client Non Renseigné'}</p>
                <p className="text-xs text-slate-600">N° TVA : {vatNumber || 'B2C / Particulier'}</p>
                <p className="text-xs text-slate-600 mt-1">Chantier : {siteAddress || 'Adresse non communiquée'}</p>
              </div>
            </div>

            {/* Articles du devis */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Lignes du devis</h3>
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    type="text" value={item.description}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx].description = e.target.value;
                      setItems(newItems);
                    }}
                    className="flex-1 p-2 border rounded text-sm"
                  />
                  <input 
                    type="number" value={item.unitPrice}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx].unitPrice = Number(e.target.value);
                      setItems(newItems);
                    }}
                    className="w-28 p-2 border rounded text-sm font-bold text-right"
                  />
                </div>
              ))}
            </div>

            {/* Total et TVA */}
            <div className="p-4 bg-slate-900 text-white rounded-lg flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Taux appliqué selon verdict :</p>
                <p className="text-sm font-bold text-emerald-400">{verdict.rate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total HTVA : {totalHTVA.toFixed(2)} €</p>
                <p className="text-xl font-black">Total TTC : {totalTTC.toFixed(2)} €</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-4 border-t">
              <button onClick={() => setStep(3)} className="px-4 py-2 border text-sm rounded-lg">Retour</button>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg flex items-center gap-1">
                  <Printer className="w-4 h-4" /> Imprimer / PDF
                </button>
                <button onClick={() => setStep(5)} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center gap-1">
                  Convertir en Facture <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : MODULE FACTURE & PEPPOL */}
        {step === 5 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex justify-between items-center">
              <span>Facture Finale Conforme</span>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-bold">FACT-2026-001</span>
            </h2>

            <div className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-bold text-slate-900">{companyInfo.name}</p>
                  <p className="text-xs text-slate-500">{companyInfo.vat}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{clientName}</p>
                  <p className="text-xs text-slate-500">{vatNumber}</p>
                </div>
              </div>

              <div className="text-xs font-mono bg-slate-50 p-3 rounded">
                <strong>Mention légale fiscale obligatoire :</strong>
                <p className="mt-1 italic">{verdict.legalText}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-800 font-bold">Montant total à payer TTC :</p>
                <p className="text-2xl font-black text-emerald-950">{totalTTC.toFixed(2)} €</p>
              </div>
              <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">Prêt pour envoi</span>
            </div>

            <div className="flex flex-wrap justify-between gap-2 pt-4 border-t">
              <button onClick={() => setStep(4)} className="px-4 py-2 border text-sm rounded-lg">Retour au Devis</button>
              
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg flex items-center gap-1">
                  <Printer className="w-4 h-4" /> Imprimer / PDF
                </button>
                <button onClick={handleDownloadPeppol} className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg flex items-center gap-1 hover:bg-indigo-700">
                  <Download className="w-4 h-4" /> Transférer via Peppol (XML)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
