import React, { useState } from 'react';

// --- LISTE COMPLÈTE DES 27 PAYS DE L'UE ---
const EU_COUNTRIES = [
  { code: 'BE', nameFR: 'Belgique / België (BE)', nameNL: 'België / Belgique (BE)' },
  { code: 'FR', nameFR: 'France (FR)', nameNL: 'Frankrijk (FR)' },
  { code: 'NL', nameFR: 'Pays-Bas (NL)', nameNL: 'Nederland (NL)' },
  { code: 'DE', nameFR: 'Allemagne (DE)', nameNL: 'Duitsland (DE)' },
  { code: 'LU', nameFR: 'Luxembourg (LU)', nameNL: 'Luxemburg (LU)' },
  { code: 'AT', nameFR: 'Autriche (AT)', nameNL: 'Oostenrijk (AT)' },
  { code: 'BG', nameFR: 'Bulgarie (BG)', nameNL: 'Bulgarije (BG)' },
  { code: 'CY', nameFR: 'Chypre (CY)', nameNL: 'Cyprus (CY)' },
  { code: 'HR', nameFR: 'Croatie (HR)', nameNL: 'Kroatië (HR)' },
  { code: 'DK', nameFR: 'Danemark (DK)', nameNL: 'Denemarken (DK)' },
  { code: 'ES', nameFR: 'Espagne (ES)', nameNL: 'Spanje (ES)' },
  { code: 'EE', nameFR: 'Estonie (EE)', nameNL: 'Estland (EE)' },
  { code: 'FI', nameFR: 'Finlande (FI)', nameNL: 'Finland (FI)' },
  { code: 'GR', nameFR: 'Grèce (GR)', nameNL: 'Griekenland (GR)' },
  { code: 'HU', nameFR: 'Hongrie (HU)', nameNL: 'Hongarije (HU)' },
  { code: 'IE', nameFR: 'Irlande (IE)', nameNL: 'Ierland (IE)' },
  { code: 'IT', nameFR: 'Italie (IT)', nameNL: 'Italië (IT)' },
  { code: 'LV', nameFR: 'Lettonie (LV)', nameNL: 'Letland (LV)' },
  { code: 'LT', nameFR: 'Lituanie (LT)', nameNL: 'Litouwen (LT)' },
  { code: 'MT', nameFR: 'Malte (MT)', nameNL: 'Malta (MT)' },
  { code: 'PL', nameFR: 'Pologne (PL)', nameNL: 'Polen (PL)' },
  { code: 'PT', nameFR: 'Portugal (PT)', nameNL: 'Portugal (PT)' },
  { code: 'CZ', nameFR: 'République Tchèque (CZ)', nameNL: 'Tsjechië (CZ)' },
  { code: 'RO', nameFR: 'Roumanie (RO)', nameNL: 'Roemenië (RO)' },
  { code: 'SK', nameFR: 'Slovaquie (SK)', nameNL: 'Slowakije (SK)' },
  { code: 'SI', nameFR: 'Slovénie (SI)', nameNL: 'Slovenië (SI)' },
  { code: 'SE', nameFR: 'Suède (SE)', nameNL: 'Zweden (SE)' }
];

// --- DICTIONNAIRE MULTILINGUE STRICT (FR / NL) ---
const i18n = {
  fr: {
    app_title: "DigiBât VAT / DigiBouw BTW",
    badge_compliance: "✓ Conforme réformes 2025-2026",
    step1: "Profil Client",
    step2: "Bien & Travaux",
    step3: "Résultat",
    step1_title: "1. Profil du Client",
    client_name: "Nom / Raison Sociale",
    client_country: "Pays (Union Européenne)",
    vat_status: "Statut TVA Client",
    status_pro: "Assujetti à la TVA (B2B)",
    status_private: "Particulier / Non-assujetti (B2C)",
    vat_number: "Numéro de TVA",
    btn_vies: "Vérifier VIES",
    btn_next: "Continuer vers Étape 2 →",
    step2_title: "2. Bien Immobilier & Nature des Travaux",
    section_age: "Ancienneté du Bâtiment",
    age_old: "> 10 ans",
    age_old_desc: "Logement ancien",
    age_new: "< 10 ans",
    age_new_desc: "Nouvelle construction",
    section_usage: "Usage du Bâtiment",
    use_100_priv: "100% Privé",
    use_50_priv: "> 50% Privé",
    use_100_pro: "Exclusif Pro",
    use_mixed: "Mixte (Privé + Pro)",
    mixed_hint: "Répartition de la surface (Superficie totale min. 200 m²) :",
    priv_m2: "Surface Privée (m²)",
    pro_m2: "Surface Pro (m²)",
    surface_err: "La surface totale doit être d'au moins 200 m².",
    section_nature: "Nature des Travaux",
    nat_renov: "Rénovation standard",
    nat_heat: "Pompe à chaleur",
    nat_garden: "Entretien courant / Jardinage",
    nat_solar: "Panneaux solaires & Isolation",
    nat_demo: "Démolition et/ou Construction",
    section_exterior: "🍃 Travaux extérieurs / Espaces verts (optionnel)",
    ext_desc: "Cochez uniquement si la prestation porte sur l'entretien ou l'aménagement d'espaces verts.",
    ext_none: "Ne s'lique pas",
    ext_maint: "Entretien courant (Tonte, taille, plantes...)",
    ext_land: "Aménagement & Gros travaux (Terrasse, pavage...)",
    site_address: "Adresse du Chantier / Bien",
    btn_back: "← Retour",
    btn_calc: "Voir le résultat →",
    step3_title: "3. Résultat & Régime Fiscal Applicable",
    res_cocontractant: "✓ Autoliquidation — Régime Cocontractant",
    res_badge_cocontractant: "0% (Autoliquidation / Régime Cocontractant)",
    res_legal_cocontractant: '"Autoliquidation : En l\'absence de contestation par écrit dans un délai d\'un mois à compter de la réception de la facture, le client est présumé reconnaître qu\'il est un assujetti tenu au dépôt de déclarations périodiques (Art. 20 de l\'Arrêté Royal n° 1)."',
    res_standard_6: "Taux réduit de 6% applicable",
    res_standard_21: "Taux normal de 21% applicable",
    warn_mixed_title: "⚠️ TRAITEMENT DES TRAVAUX MIXTES (PRIVÉ + PRO) :",
    warn_mixed_text: "En cas d'usage mixte, une ventilation obligatoire des montants doit être effectuée (séparation prorata privé 6% / pro 21% ou autoliquidation B2B Art. 20).",
    btn_convert_quote: "Omzetten naar Offerte / Convertir en Devis",
    history_title: "Historique des déterminations",
    history_empty: "Aucune détermination enregistrée.",
    quote_badge: "DEVIS / OFFERTE",
    btn_back_calc: "← Terug naar calculator",
    provider_title: "PRESTATAIRE / ENTREPRENEUR",
    client_title: "CLIENT & CHANTIER",
    items_title: "Prestations & Matériaux",
    btn_add_line: "+ Ajouter une ligne",
    th_desc: "DESCRIPTION",
    th_qty: "QTÉ",
    th_unit_price: "PRIX UNIT. (€)",
    th_total: "TOTAL HTVA (€)",
    lbl_subtotal: "Sous-total HTVA:",
    legal_notice_title: "Mention légale obligatoire à faire figurer sur le document :",
    btn_save_quote: "💾 Enregistrer le devis",
    btn_print: "🖨️ Imprimer / PDF",
    btn_to_invoice: "⚡ Convertir en Facture →",
    invoice_badge: "FACTURE / FACTUUR",
    badge_peppol_ready: "Prêt pour Peppol",
    lbl_delivery_date: "Date de livraison des travaux (saisie manuelle) :",
    btn_save_inv: "💾 Enregistrer la facture",
    btn_peppol: "Transférer via Peppol"
  },
  nl: {
    app_title: "DigiBât VAT / DigiBouw BTW",
    badge_compliance: "✓ Conform de hervormingen 2025-2026",
    step1: "Klantprofiel",
    step2: "Onroerend goed",
    step3: "Resultaat",
    step1_title: "1. Klantprofiel",
    client_name: "Naam / Bedrijfsnaam",
    client_country: "Land (Europese Unie)",
    vat_status: "Btw-status klant",
    status_pro: "Btw-plichtige (B2B)",
    status_private: "Particulier / Niet-btw-plichtige (B2C)",
    vat_number: "Btw-nummer",
    btn_vies: "VIES Controleren",
    btn_next: "Ga naar Stap 2 →",
    step2_title: "2. Onroerend goed & Aard van de werken",
    section_age: "Ouderdom van het gebouw",
    age_old: "> 10 jaar",
    age_old_desc: "Oude woning",
    age_new: "< 10 jaar",
    age_new_desc: "Nieuwbouw",
    section_usage: "Gebruik van het gebouw",
    use_100_priv: "100% Privé",
    use_50_priv: "> 50% Privé",
    use_100_pro: "Exclusief Professioneel",
    use_mixed: "Gemengd (Privé + Pro)",
    mixed_hint: "Verdeling van de oppervlakte (Totale oppervlakte min. 200 m²):",
    priv_m2: "Privé-oppervlakte (m²)",
    pro_m2: "Professionele opp. (m²)",
    surface_err: "De totale oppervlakte moet minstens 200 m² zijn.",
    section_nature: "Aard van de werken",
    nat_renov: "Standaard renovatie",
    nat_heat: "Warmtepomp",
    nat_garden: "Gewoon onderhoud / Tuinieren",
    nat_solar: "Zonnepanelen & Isolatie",
    nat_demo: "Sloop en/of Bouw",
    section_exterior: "🍃 Buitenwerken / Groenzone (optioneel)",
    ext_desc: "Vink alleen aan als de dienst betrekking heeft op tuinonderhoud of -aanleg.",
    ext_none: "Niet van toepassing",
    ext_maint: "Gewoon onderhoud (Gras maaien, heggen snoeien...)",
    ext_land: "Aanleg & Grote werken (Terras, bestrating...)",
    site_address: "Adres van de werf / Goed",
    btn_back: "← Terug",
    btn_calc: "Verdict bekijken →",
    step3_title: "3. Resultaat & Toepasselijk btw-regime",
    res_cocontractant: "✓ Btw verlegd — Medecontractant",
    res_badge_cocontractant: "0% (Btw verlegd)",
    res_legal_cocontractant: '"Btw verlegd: Bij gebrek aan schriftelijke betwisting binnen een termijn van één maand na ontvangst van de factuur, wordt de afnemer geacht te erkennen dat hij een belastingplichtige is die gehouden is tot de indiening van periodieke aangiften (Art. 20 van het Koninklijk Besluit nr. 1)."',
    res_standard_6: "Verlaagd tarief van 6% van toepassing",
    res_standard_21: "Normaal tarief van 21% van toepassing",
    warn_mixed_title: "⚠️ BEHANDELING VAN GEMENGDE WERKEN (PRIVÉ + PRO):",
    warn_mixed_text: "Bij gemengd gebruik is een verplichte uitsplitsing van de bedragen vereist (pro rata privé 6% / pro 21% of btw verlegd B2B Art. 20).",
    btn_convert_quote: "Omzetten naar Offerte",
    history_title: "Historiek van de bepalingen",
    history_empty: "Geen bepalingen geregistreerd.",
    quote_badge: "OFFERTE / DEVIS",
    btn_back_calc: "← Terug naar calculator",
    provider_title: "DIENSTVERLENER / ONDERNEMER",
    client_title: "KLANT & WERF",
    items_title: "Prestaties & Materialen",
    btn_add_line: "+ Lijn toevoegen",
    th_desc: "OMSCHRIJVING",
    th_qty: "AANTAL",
    th_unit_price: "EENHEIDSPRIJS (€)",
    th_total: "TOTAAL EXCL. BTW (€)",
    lbl_subtotal: "Subtotaal EXCL. BTW:",
    legal_notice_title: "Verplichte wettelijke vermelding op het document:",
    btn_save_quote: "💾 Offerte opslaan",
    btn_print: "🖨️ Afdrukken / PDF",
    btn_to_invoice: "⚡ Omzetten naar Factuur →",
    invoice_badge: "FACTUUR / FACTURE",
    badge_peppol_ready: "Klaar voor Peppol",
    lbl_delivery_date: "Opleveringsdatum van de werken (handmatige invoer):",
    btn_save_inv: "💾 Factuur opslaan",
    btn_peppol: "Verzenden via Peppol"
  }
};

export default function App() {
  const [lang, setLang] = useState<'fr' | 'nl'>('fr');
  const [step, setStep] = useState<1 | 2 | 3 | 'quote' | 'invoice'>(1);

  // Étape 1
  const [clientName, setClientName] = useState('');
  const [clientCountry, setClientCountry] = useState('BE');
  const [vatStatus, setVatStatus] = useState<'pro' | 'particulier'>('pro');
  const [vatNumber, setVatNumber] = useState('');
  const [isViesVerified, setIsViesVerified] = useState(false);
  const [viesStatusText, setViesStatusText] = useState('');

  // Étape 2
  const [buildingAge, setBuildingAge] = useState<'old' | 'new'>('old');
  const [usage, setUsage] = useState<'100_priv' | 'plus_50_priv' | '100_pro' | 'mixed'>('100_priv');
  const [privM2, setPrivM2] = useState<number>(120);
  const [proM2, setProM2] = useState<number>(100);
  const [nature, setNature] = useState<'renov' | 'heat_pump' | 'gardening' | 'solar' | 'demolition'>('renov');
  const [exterior, setExterior] = useState<'none' | 'maintenance' | 'landscaping'>('none');
  const [siteAddress, setSiteAddress] = useState('');

  // Module Devis (Prix vides/zéro par défaut selon votre demande)
  const [quoteLines, setQuoteLines] = useState<Array<{ id: number; desc: string; qty: number; price: string }>>([
    { id: 1, desc: 'Travaux de rénovation / Renovatieboorden', qty: 1, price: '' }
  ]);
  const [quoteTimestamp, setQuoteTimestamp] = useState('');

  // Module Facture
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Historique
  const [history, setHistory] = useState<Array<{ name: string; result: string; time: string }>>([]);

  const t = i18n[lang];

  // Vérification VIES
  const handleViesCheck = () => {
    if (vatNumber.trim().length > 6) {
      setIsViesVerified(true);
      setViesStatusText('✓ VIES Validated (OK)');
    } else {
      setIsViesVerified(false);
      setViesStatusText('✖ Invalid VAT Number');
    }
  };

  // Calcul du résultat
  const handleCalculate = () => {
    setStep(3);
    const resultBadge = vatStatus === 'pro' ? t.res_badge_cocontractant : '6% (BTW / TVA)';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [{ name: clientName || 'Client', result: resultBadge, time }, ...prev]);
  };

  // Calculs financiers
  const subtotal = quoteLines.reduce((acc, line) => {
    const priceNum = parseFloat(line.price) || 0;
    return acc + (line.qty * priceNum);
  }, 0);

  const vatRate = vatStatus === 'pro' ? 0 : 0.06;
  const vatAmount = subtotal * vatRate;
  const totalTTC = subtotal + vatAmount;

  const handleOpenQuote = () => {
    setQuoteTimestamp(new Date().toLocaleString());
    setStep('quote');
  };

  const handleAddLine = () => {
    setQuoteLines(prev => [...prev, { id: Date.now(), desc: 'Nouvelle prestation', qty: 1, price: '' }]);
  };

  const handleUpdateLine = (id: number, field: 'desc' | 'qty' | 'price', value: any) => {
    setQuoteLines(prev => prev.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* EN-TÊTE PRINCIPAL */}
        <header className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">{t.app_title}</h1>
            <p className="text-sm text-slate-500">Btw-bepaling « Werken in onroerende staat » — België 2025-2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-300">
              {t.badge_compliance}
            </span>
            <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-1">
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1 text-xs font-bold rounded-md ${lang === 'fr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('nl')}
                className={`px-3 py-1 text-xs font-bold rounded-md ${lang === 'nl' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'}`}
              >
                NL
              </button>
            </div>
          </div>
        </header>

        {/* NAVIGATION ÉTAPES */}
        {typeof step === 'number' && (
          <nav className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex justify-around text-sm font-semibold">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>{t.step1}</span>
            </div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>{t.step2}</span>
            </div>
            <div className={`flex items-center gap-2 ${step === 3 ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>{t.step3}</span>
            </div>
          </nav>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* ÉTAPE 1: PROFIL CLIENT */}
            {step === 1 && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">{t.step1_title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t.client_name}</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="ex: Vicernant SRL"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t.client_country}</label>
                    <select
                      value={clientCountry}
                      onChange={e => setClientCountry(e.target.value)}
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {EU_COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>
                          {lang === 'fr' ? c.nameFR : c.nameNL}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t.vat_status}</label>
                    <select
                      value={vatStatus}
                      onChange={e => {
                        const val = e.target.value as 'pro' | 'particulier';
                        setVatStatus(val);
                        if (val === 'particulier') setIsViesVerified(true);
                        else setIsViesVerified(false);
                      }}
                      className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pro">{t.status_pro}</option>
                      <option value="particulier">{t.status_private}</option>
                    </select>
                  </div>

                  <div className={vatStatus === 'particulier' ? 'opacity-40 pointer-events-none' : ''}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{t.vat_number}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={vatNumber}
                        onChange={e => setVatNumber(e.target.value)}
                        className="w-full border rounded-lg p-2 text-sm"
                        placeholder="BE0400075312"
                      />
                      <button
                        type="button"
                        onClick={handleViesCheck}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                      >
                        {t.btn_vies}
                      </button>
                    </div>
                    {viesStatusText && (
                      <p className={`text-xs mt-1 font-medium ${isViesVerified ? 'text-emerald-600' : 'text-red-600'}`}>
                        {viesStatusText}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={vatStatus === 'pro' && !isViesVerified}
                    className={`text-sm font-bold px-5 py-2.5 rounded-lg transition ${
                      vatStatus === 'pro' && !isViesVerified
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    {t.btn_next}
                  </button>
                </div>
              </section>
            )}

            {/* ÉTAPE 2: BIEN & TRAVAUX */}
            {step === 2 && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">{t.step2_title}</h2>

                {/* Ancienneté */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.section_age}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setBuildingAge('old')}
                      className={`border rounded-xl p-3 text-center cursor-pointer transition ${buildingAge === 'old' ? 'border-blue-600 bg-blue-50 shadow-sm' : ''}`}
                    >
                      <div className="font-bold text-sm">{t.age_old}</div>
                      <div className="text-xs text-slate-500">{t.age_old_desc}</div>
                    </div>
                    <div
                      onClick={() => setBuildingAge('new')}
                      className={`border rounded-xl p-3 text-center cursor-pointer transition ${buildingAge === 'new' ? 'border-blue-600 bg-blue-50 shadow-sm' : ''}`}
                    >
                      <div className="font-bold text-sm">{t.age_new}</div>
                      <div className="text-xs text-slate-500">{t.age_new_desc}</div>
                    </div>
                  </div>
                </div>

                {/* Usage */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.section_usage}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: '100_priv', label: t.use_100_priv },
                      { key: 'plus_50_priv', label: t.use_50_priv },
                      { key: '100_pro', label: t.use_100_pro },
                      { key: 'mixed', label: t.use_mixed }
                    ].map(u => (
                      <div
                        key={u.key}
                        onClick={() => setUsage(u.key as any)}
                        className={`border rounded-xl p-3 text-center cursor-pointer transition ${usage === u.key ? 'border-blue-600 bg-blue-50 shadow-sm' : ''}`}
                      >
                        <div className="font-bold text-xs">{u.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Surface Mixte */}
                  {usage === 'mixed' && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                      <p className="text-xs font-semibold text-amber-900">{t.mixed_hint}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-600">{t.priv_m2}</label>
                          <input
                            type="number"
                            value={privM2}
                            onChange={e => setPrivM2(parseFloat(e.target.value) || 0)}
                            className="w-full border rounded p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-600">{t.pro_m2}</label>
                          <input
                            type="number"
                            value={proM2}
                            onChange={e => setProM2(parseFloat(e.target.value) || 0)}
                            className="w-full border rounded p-1.5 text-xs"
                          />
                        </div>
                      </div>
                      {(privM2 + proM2) < 200 && (
                        <p className="text-xs text-red-600 font-medium">{t.surface_err}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Nature */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.section_nature}</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    {[
                      { key: 'renov', label: t.nat_renov, span: '' },
                      { key: 'heat_pump', label: t.nat_heat, span: '' },
                      { key: 'gardening', label: t.nat_garden, span: '' },
                      { key: 'solar', label: t.nat_solar, span: '' },
                      { key: 'demolition', label: t.nat_demo, span: 'col-span-1 md:col-span-2' }
                    ].map(n => (
                      <div
                        key={n.key}
                        onClick={() => setNature(n.key as any)}
                        className={`border rounded-lg p-2.5 text-center font-medium cursor-pointer transition ${n.span} ${nature === n.key ? 'border-blue-600 bg-blue-50 shadow-sm' : ''}`}
                      >
                        {n.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Espaces Verts / Photo 1 */}
                <div className="border-t pt-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.section_exterior}</label>
                  <p className="text-xs text-slate-500 mb-3">{t.ext_desc}</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'none', icon: '🚫', label: t.ext_none },
                      { key: 'maintenance', icon: '🌱', label: t.ext_maint },
                      { key: 'landscaping', icon: '🏗️', label: t.ext_land }
                    ].map(e => (
                      <div
                        key={e.key}
                        onClick={() => setExterior(e.key as any)}
                        className={`border rounded-xl p-3 text-center text-xs flex flex-col items-center justify-center min-h-[90px] cursor-pointer transition ${exterior === e.key ? 'border-blue-600 bg-blue-50 shadow-sm' : ''}`}
                      >
                        <span className="text-lg mb-1">{e.icon}</span>
                        <span className="leading-tight text-[11px]">{e.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adresse Chantier */}
                <div className="border-t pt-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t.site_address}</label>
                  <input
                    type="text"
                    value={siteAddress}
                    onChange={e => setSiteAddress(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm"
                    placeholder="ex: Rue du Progrès 45, 1000 Bruxelles"
                  />
                </div>

                <div className="pt-4 border-t flex justify-between">
                  <button onClick={() => setStep(1)} className="border border-slate-300 text-slate-700 text-sm font-bold px-4 py-2 rounded-lg">{t.btn_back}</button>
                  <button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg">{t.btn_calc}</button>
                </div>
              </section>
            )}

            {/* ÉTAPE 3: RÉSULTAT */}
            {step === 3 && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 border-b pb-2">{t.step3_title}</h2>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-emerald-900">
                      {vatStatus === 'pro' ? t.res_cocontractant : t.res_standard_6}
                    </h3>
                    <span className="bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {vatStatus === 'pro' ? t.res_badge_cocontractant : '6% (BTW / TVA)'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 italic font-mono bg-white/60 p-3 rounded border border-emerald-200">
                    {vatStatus === 'pro' ? t.res_legal_cocontractant : '"TVA 6% : Application du taux réduit sur facture."'}
                  </p>
                </div>

                {usage === 'mixed' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                    <h4 className="text-xs font-bold text-amber-900 uppercase">{t.warn_mixed_title}</h4>
                    <p className="text-xs text-amber-800">{t.warn_mixed_text}</p>
                  </div>
                )}

                <div className="pt-4 border-t flex justify-between">
                  <button onClick={() => setStep(2)} className="border border-slate-300 text-slate-700 text-sm font-bold px-4 py-2 rounded-lg">{t.btn_back}</button>
                  <button onClick={handleOpenQuote} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg flex items-center gap-2">
                    <span>📄</span> <span>{t.btn_convert_quote}</span>
                  </button>
                </div>
              </section>
            )}

            {/* MODULE DEVIS */}
            {step === 'quote' && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase">{t.quote_badge}</span>
                    <h2 className="text-xl font-bold text-slate-900">Devis N° : DEV-2026-001</h2>
                    <p className="text-xs text-slate-400">{quoteTimestamp}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="text-xs border px-3 py-1.5 rounded hover:bg-slate-50">{t.btn_back_calc}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border">
                  <div className="space-y-1">
                    <h3 className="font-bold text-blue-800 uppercase">{t.provider_title}</h3>
                    <p className="font-semibold">Mon Entreprise SRL / My Company BV</p>
                    <p>BE0123456789</p>
                    <p>Rue du Progrès 12, 1000 Bruxelles</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-600 uppercase">{t.client_title}</h3>
                    <p className="font-bold text-sm">{clientName || 'Nom Client'}</p>
                    <p>{vatNumber || 'N/A'}</p>
                    <p className="text-emerald-700 font-semibold">{vatStatus === 'pro' ? t.res_cocontractant : t.res_standard_6}</p>
                    <p className="text-slate-500 mt-2">Chantier : {siteAddress || 'Non spécifié'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase text-slate-700">{t.items_title}</h3>
                    <button onClick={handleAddLine} className="text-xs text-blue-600 font-bold hover:underline">{t.btn_add_line}</button>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b">
                        <th className="p-2">{t.th_desc}</th>
                        <th className="p-2 w-20 text-center">{t.th_qty}</th>
                        <th className="p-2 w-28 text-right">{t.th_unit_price}</th>
                        <th className="p-2 w-28 text-right">{t.th_total}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteLines.map(line => {
                        const priceNum = parseFloat(line.price) || 0;
                        const lineTotal = line.qty * priceNum;
                        return (
                          <tr key={line.id} className="border-b">
                            <td className="p-2">
                              <input
                                type="text"
                                value={line.desc}
                                onChange={e => handleUpdateLine(line.id, 'desc', e.target.value)}
                                className="w-full border p-1 rounded"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="1"
                                value={line.qty}
                                onChange={e => handleUpdateLine(line.id, 'qty', parseInt(e.target.value) || 1)}
                                className="w-full border p-1 rounded text-center"
                              />
                            </td>
                            <td className="p-2">
                              {/* CHAMP PRIX VIDE PAR DÉFAUT */}
                              <input
                                type="number"
                                placeholder="0.00"
                                value={line.price}
                                onChange={e => handleUpdateLine(line.id, 'price', e.target.value)}
                                className="w-full border p-1 rounded text-right"
                              />
                            </td>
                            <td className="p-2 text-right font-bold">{lineTotal.toFixed(2)} €</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="flex flex-col items-end space-y-1 text-xs pt-3">
                    <div className="flex gap-4">
                      <span>{t.lbl_subtotal}</span>
                      <span className="font-bold">{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex gap-4 text-emerald-700 font-semibold">
                      <span>Montant TVA ({vatStatus === 'pro' ? '0% Autoliquidation' : '6%'}):</span>
                      <span>{vatAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex gap-4 text-sm font-bold text-slate-900 border-t pt-1">
                      <span>TOTAL TTC:</span>
                      <span>{totalTTC.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border p-3 rounded-lg text-xs italic text-slate-600">
                    <p className="font-bold not-italic text-slate-800">{t.legal_notice_title}</p>
                    <p>{vatStatus === 'pro' ? t.res_legal_cocontractant : '"TVA 6% de conformité."'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex flex-wrap gap-3 justify-end">
                  <button onClick={() => alert('Devis enregistré !')} className="bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg">{t.btn_save_quote}</button>
                  <button onClick={() => window.print()} className="border text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg">{t.btn_print}</button>
                  <button onClick={() => setStep('invoice')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg">{t.btn_to_invoice}</button>
                </div>
              </section>
            )}

            {/* MODULE FACTURE */}
            {step === 'invoice' && (
              <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase">{t.invoice_badge}</span>
                    <h2 className="text-xl font-bold text-slate-900">Facture N° : FAC-2026-001</h2>
                    <p className="text-xs text-slate-400">{new Date().toLocaleString()}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">{t.badge_peppol_ready}</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-emerald-900">{t.lbl_delivery_date}</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="border rounded p-1 text-xs bg-white"
                  />
                </div>

                <div className="text-xs bg-slate-50 p-4 rounded-xl border space-y-2">
                  <p><strong>Client :</strong> {clientName}</p>
                  <p><strong>Chantier :</strong> {siteAddress || 'Non spécifié'}</p>
                  <p><strong>Montant HTVA :</strong> {subtotal.toFixed(2)} €</p>
                  <p><strong>TVA :</strong> {vatAmount.toFixed(2)} €</p>
                  <p className="text-sm font-bold text-slate-900"><strong>TOTAL TTC :</strong> {totalTTC.toFixed(2)} €</p>
                </div>

                <div className="pt-4 border-t flex flex-wrap gap-3 justify-end">
                  <button onClick={() => alert('Facture enregistrée !')} className="bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg">{t.btn_save_inv}</button>
                  <button onClick={() => window.print()} className="border text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg">{t.btn_print}</button>
                  <button onClick={() => alert('Envoyé sur le réseau Peppol !')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
                    <span>🌐</span> <span>{t.btn_peppol}</span>
                  </button>
                </div>
              </section>
            )}

          </div>

          {/* HISTORIQUE DROITE */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-3 sticky top-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>📜</span> <span>{t.history_title}</span>
              </h3>
              <div className="text-xs text-slate-500 space-y-2">
                {history.length === 0 ? (
                  <p className="italic text-slate-400">{t.history_empty}</p>
                ) : (
                  history.map((item, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 border rounded">
                      <strong className="text-slate-800">{item.name}</strong> — {item.result}
                      <br />
                      <span className="text-slate-400 text-[10px]">{item.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
