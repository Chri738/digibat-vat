{/* Sélecteur de langue clair et explicite */}
<div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
  <button
    type="button"
    onClick={() => setLang('FR')}
    className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
      lang === 'FR' 
        ? 'bg-white text-blue-600 shadow-sm' 
        : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    🇫🇷 FR
  </button>
  <button
    type="button"
    onClick={() => setLang('NL')}
    className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
      lang === 'NL' 
        ? 'bg-white text-blue-600 shadow-sm' 
        : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    🇳🇱 NL
  </button>
</div>
