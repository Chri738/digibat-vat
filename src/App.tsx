import { useState } from 'react';
import { calculateBelgianVat } from './vatEngine';
import { VatInput, ClientType, PropertyUsage, TargetScope } from './types/vat';

export default function App() {
  const [input, setInput] = useState<VatInput>({
    transaction: {
      issueDate: new Date().toISOString().split('T')[0],
      currency: 'EUR',
    },
    client: {
      type: 'INDIVIDUAL',
      countryCode: 'BE',
      vatNumber: '',
      submitsPeriodicVatReturns: false,
    },
    property: {
      countryCode: 'BE',
      usage: 'PRIVATE',
      firstOccupancyYear: 2010,
      privateUsePercentage: 100,
    },
    service: {
      isRealEstateWork: true,
      targetScope: 'ENTIRE_BUILDING',
      description: 'Travaux de rénovation',
    },
  });

  const result = calculateBelgianVat(input);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Simulateur de TVA Belge — Digibat
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Calcul automatique du taux de TVA et des mentions légales réglementaires pour travaux immobiliers.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de saisie */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">
              1. Données du chantier & client
            </h2>

            {/* Travail immobilier ? */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.service.isRealEstateWork}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      service: { ...input.service, isRealEstateWork: e.target.checked },
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>S'agit-il de travaux immobiliers ?</span>
              </label>
            </div>

            {/* Type de client */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type de client
              </label>
              <select
                value={input.client.type}
                onChange={(e) => {
                  const type = e.target.value as ClientType;
                  const isCompany = type === 'COMPANY';
                  setInput({
                    ...input,
                    client: {
                      ...input.client,
                      type,
                      submitsPeriodicVatReturns: isCompany ? input.client.submitsPeriodicVatReturns : false,
                    },
                  });
                }}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="INDIVIDUAL">Particulier</option>
                <option value="COMPANY">Société / Entreprise (B2B)</option>
                <option value="PUBLIC_ENTITY">Entité Publique</option>
              </select>
            </div>

            {/* Assujetti déposant des déclarations ? */}
            {input.client.type === 'COMPANY' && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <label className="flex items-center space-x-2 text-sm text-blue-900 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.client.submitsPeriodicVatReturns}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        client: { ...input.client, submitsPeriodicVatReturns: e.target.checked },
                      })
                    }
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Dépose des déclarations périodiques TVA (Art. 20 - Cocontractant)</span>
                </label>
              </div>
            )}

            {/* Usage de l'immeuble */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Usage du bâtiment
              </label>
              <select
                value={input.property.usage}
                onChange={(e) =>
                  setInput({
                    ...input,
                    property: { ...input.property, usage: e.target.value as PropertyUsage },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="PRIVATE">Logement Privé</option>
                <option value="PROFESSIONAL">Bâtiment Professionnel</option>
                <option value="MIXED">Usage Mixte (Privé + Professionnel)</option>
              </select>
            </div>

            {/* Si mixte : pourcentage privé */}
            {input.property.usage === 'MIXED' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Pourcentage d'usage privé (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={input.property.privateUsePercentage ?? 50}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      property: { ...input.property, privateUsePercentage: Number(e.target.value) },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Année de première occupation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Année de 1ère occupation de l'immeuble
              </label>
              <input
                type="number"
                value={input.property.firstOccupancyYear}
                onChange={(e) =>
                  setInput({
                    ...input,
                    property: { ...input.property, firstOccupancyYear: Number(e.target.value) },
                  })
                }
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Ancienneté du bâtiment : {new Date().getFullYear() - input.property.firstOccupancyYear} ans
                {new Date().getFullYear() - input.property.firstOccupancyYear >= 10
                  ? ' (≥ 10 ans : Éligible au taux réduit de 6%)'
                  : ' (< 10 ans : Soumis au taux standard de 21%)'}
              </p>
            </div>

            {/* Portée des travaux si mixte */}
            {input.property.usage === 'MIXED' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Portée des travaux
                </label>
                <select
                  value={input.service.targetScope}
                  onChange={(e) =>
                    setInput({
                      ...input,
                      service: { ...input.service, targetScope: e.target.value as TargetScope },
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ENTIRE_BUILDING">Ensemble du bâtiment</option>
                  <option value="PRIVATE_PART">Partie Privée uniquement</option>
                  <option value="PROFESSIONAL_PART">Partie Professionnelle uniquement</option>
                  <option value="COMMON_PART">Parties communes</option>
                </select>
              </div>
            )}
          </div>

          {/* Panneau de Résultat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">
                2. Régime de TVA déterminé
              </h2>

              <div className="space-y-4">
                {/* Régime fiscal */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Régime fiscal :</span>
                  <span className="font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {result.taxRegime}
                  </span>
                </div>

                {/* Taux appliqués */}
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 border border-slate-100">
                  <span className="text-sm font-medium text-slate-600 block mb-1">Taux applicables :</span>
                  {result.rates.map((rateInfo, index) => (
                    <div key={index} className="flex justify-between items-center text-sm border-b border-slate-200 last:border-0 pb-1 last:pb-0">
                      <span className="text-slate-700">Taux : <strong className="text-slate-900">{rateInfo.rate}%</strong></span>
                      <span className="text-slate-500">{rateInfo.percentageOfTotal}% du montant HTVA</span>
                    </div>
                  ))}
                </div>

                {/* Mention Légale Obligatoire */}
                {result.legalMentionText ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                      Mention obligatoire à figurer sur la facture ({result.legalMentionCode})
                    </span>
                    <p className="text-xs text-amber-900 leading-relaxed italic">
                      "{result.legalMentionText}"
                    </p>
                    {result.legalReferences.length > 0 && (
                      <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-700">
                        <strong>Références légales :</strong> {result.legalReferences.join(' | ')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-500 italic border border-slate-100">
                    Aucune mention obligatoire spécifique requise sur la facture pour ce régime standard.
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-400 text-center pt-4 border-t border-slate-100">
              Moteur métier exécuté depuis <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">src/vatEngine.ts</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
