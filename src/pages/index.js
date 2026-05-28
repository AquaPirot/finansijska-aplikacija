import { useState, useEffect, useMemo } from 'react';
import { calculateGotovinaZaUplatu, calculateUkupnoGotovina } from '../utils/calculations';
import { saveCalculation, getCalculations, getAllDates, deleteCalculation } from '../utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('kalkulator');

  // Kalkulator state
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]);
  const [gotovinaPoProgramu, setGotovinaPoProgramu] = useState('');
  const [karticaPoProgramu, setKarticaPoProgramu] = useState('');
  const [karticaPoIzvodu, setKarticaPoIzvodu] = useState('');
  const [popustPoProgramu, setPopustPoProgramu] = useState('');
  const [popustVIP, setPopustVIP] = useState('');
  const [sacuvano, setSacuvano] = useState(false);

  // Istorija state
  const [allCalculations, setAllCalculations] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  // Live kalkulacija
  const gotovinaZaUplatu = useMemo(() => calculateGotovinaZaUplatu({
    gotovinaPoProgramu: Number(gotovinaPoProgramu) || 0,
    karticaPoProgramu: Number(karticaPoProgramu) || 0,
    karticaPoIzvodu: Number(karticaPoIzvodu) || 0,
  }), [gotovinaPoProgramu, karticaPoProgramu, karticaPoIzvodu]);

  const ukupnoGotovina = useMemo(() => calculateUkupnoGotovina({
    gotovinaZaUplatu,
    popustPoProgramu: Number(popustPoProgramu) || 0,
    popustVIP: Number(popustVIP) || 0,
  }), [gotovinaZaUplatu, popustPoProgramu, popustVIP]);

  const hasInputs = !!(gotovinaPoProgramu || karticaPoProgramu || karticaPoIzvodu);

  const loadData = () => {
    setAllCalculations(getCalculations());
    setAllDates(getAllDates());
  };

  useEffect(() => { loadData(); }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const displayCalculations = selectedDate
    ? allCalculations.filter(c => c.datum === selectedDate)
    : allCalculations;

  const totalDanas = allCalculations
    .filter(c => c.datum === todayStr)
    .reduce((sum, c) => sum + (c.ukupnoGotovina || 0), 0);

  const totalFiltered = displayCalculations
    .reduce((sum, c) => sum + (c.ukupnoGotovina || 0), 0);

  const getTotalForDate = (d) =>
    allCalculations.filter(c => c.datum === d).reduce((sum, c) => sum + (c.ukupnoGotovina || 0), 0);

  const formatDate = (d) => {
    const [year, month, day] = d.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('sr-RS', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const handleSacuvaj = () => {
    saveCalculation({
      datum,
      gotovinaPoProgramu: Number(gotovinaPoProgramu) || 0,
      karticaPoProgramu: Number(karticaPoProgramu) || 0,
      karticaPoIzvodu: Number(karticaPoIzvodu) || 0,
      gotovinaZaUplatu,
      popustPoProgramu: Number(popustPoProgramu) || 0,
      popustVIP: Number(popustVIP) || 0,
      ukupnoGotovina,
    });
    setSacuvano(true);
    loadData();
  };

  const handleResetuj = () => {
    setGotovinaPoProgramu('');
    setKarticaPoProgramu('');
    setKarticaPoIzvodu('');
    setPopustPoProgramu('');
    setPopustVIP('');
    setSacuvano(false);
    setDatum(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = (id) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu kalkulaciju?')) {
      deleteCalculation(id);
      loadData();
    }
  };

  const inputCls = "w-full p-3 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-md min-h-screen bg-white shadow-sm flex flex-col">

        {/* Header + tabs */}
        <div className="bg-white border-b border-gray-200 px-4 pt-4 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-center text-gray-800 mb-3">Finansijska aplikacija</h1>
          <div className="flex">
            <button
              onClick={() => setActiveTab('kalkulator')}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'kalkulator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-400'
              }`}
            >
              Kalkulator
            </button>
            <button
              onClick={() => { setActiveTab('istorija'); loadData(); }}
              className={`flex-1 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'istorija'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-400'
              }`}
            >
              Istorija
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1">

          {/* ===== KALKULATOR ===== */}
          {activeTab === 'kalkulator' && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-700">Datum</label>
                <input
                  type="date"
                  value={datum}
                  onChange={(e) => { setDatum(e.target.value); setSacuvano(false); }}
                  className={inputCls}
                />
              </div>

              {/* Prihodi */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prihodi</h2>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">Gotovina po programu</label>
                  <input
                    type="number" inputMode="numeric" placeholder="0"
                    value={gotovinaPoProgramu}
                    onChange={(e) => { setGotovinaPoProgramu(e.target.value); setSacuvano(false); }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">Kartica po programu</label>
                  <input
                    type="number" inputMode="numeric" placeholder="0"
                    value={karticaPoProgramu}
                    onChange={(e) => { setKarticaPoProgramu(e.target.value); setSacuvano(false); }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">Kartica po izvodu</label>
                  <input
                    type="number" inputMode="numeric" placeholder="0"
                    value={karticaPoIzvodu}
                    onChange={(e) => { setKarticaPoIzvodu(e.target.value); setSacuvano(false); }}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Popusti */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Popusti</h2>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">Popust po programu</label>
                  <input
                    type="number" inputMode="numeric" placeholder="0"
                    value={popustPoProgramu}
                    onChange={(e) => { setPopustPoProgramu(e.target.value); setSacuvano(false); }}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-sm font-medium text-gray-700">Popust VIP</label>
                  <input
                    type="number" inputMode="numeric" placeholder="0"
                    value={popustVIP}
                    onChange={(e) => { setPopustVIP(e.target.value); setSacuvano(false); }}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Rezultati — prikazuju se čim ima unosa */}
              {hasInputs && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-500">Gotovina za uplatu</span>
                    <span className="font-semibold text-gray-800">
                      {gotovinaZaUplatu.toLocaleString('sr-RS')} RSD
                    </span>
                  </div>
                  <div className="bg-blue-500 rounded-xl p-5 text-white">
                    <p className="text-sm font-medium opacity-75 mb-1">Ukupno gotovina</p>
                    <p className="text-4xl font-bold">
                      {ukupnoGotovina.toLocaleString('sr-RS')}{' '}
                      <span className="text-lg font-normal">RSD</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Akcije */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleResetuj}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm"
                >
                  Resetuj
                </button>
                <button
                  onClick={handleSacuvaj}
                  disabled={!hasInputs || sacuvano}
                  className={`flex-[2] py-3 rounded-xl font-semibold text-sm transition-colors ${
                    sacuvano
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : hasInputs
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {sacuvano ? 'Sačuvano' : 'Sačuvaj kalkulaciju'}
                </button>
              </div>
            </div>
          )}

          {/* ===== ISTORIJA ===== */}
          {activeTab === 'istorija' && (
            <div className="space-y-4">

              {/* Sumarni paneli */}
              {allDates.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">Danas</p>
                    <p className="text-xl font-bold text-gray-800">{totalDanas.toLocaleString('sr-RS')}</p>
                    <p className="text-xs text-gray-400">RSD</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                    <p className="text-xs text-blue-500 mb-1">
                      {selectedDate ? 'Izabrani datum' : 'Ukupno sve'}
                    </p>
                    <p className="text-xl font-bold text-blue-700">{totalFiltered.toLocaleString('sr-RS')}</p>
                    <p className="text-xs text-blue-400">RSD</p>
                  </div>
                </div>
              )}

              {allDates.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-sm mb-4">Nema sačuvanih kalkulacija</p>
                  <button
                    onClick={() => setActiveTab('kalkulator')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium text-sm"
                  >
                    Kreiraj prvu kalkulaciju
                  </button>
                </div>
              ) : (
                <>
                  {/* Filter */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-gray-700">Filtriraj po datumu</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Svi datumi</option>
                      {allDates.map(d => (
                        <option key={d} value={d}>
                          {formatDate(d)} — {getTotalForDate(d).toLocaleString('sr-RS')} RSD
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kartice kalkulacija */}
                  <div className="space-y-3">
                    {displayCalculations.length === 0 ? (
                      <p className="text-gray-400 text-center py-8 text-sm">
                        Nema kalkulacija za izabrani datum
                      </p>
                    ) : (
                      displayCalculations.map((calc) => (
                        <div key={calc.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{formatDate(calc.datum)}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(calc.timestamp).toLocaleString('sr-RS')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDelete(calc.id)}
                              className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded"
                            >
                              Obriši
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                            <p>Got. po prog.: <span className="font-semibold text-gray-700">{calc.gotovinaPoProgramu.toLocaleString('sr-RS')}</span></p>
                            <p>Pop. po prog.: <span className="font-semibold text-gray-700">{calc.popustPoProgramu.toLocaleString('sr-RS')}</span></p>
                            <p>Kart. po prog.: <span className="font-semibold text-gray-700">{calc.karticaPoProgramu.toLocaleString('sr-RS')}</span></p>
                            <p>Pop. VIP: <span className="font-semibold text-gray-700">{calc.popustVIP.toLocaleString('sr-RS')}</span></p>
                            <p>Kart. po izv.: <span className="font-semibold text-gray-700">{calc.karticaPoIzvodu.toLocaleString('sr-RS')}</span></p>
                          </div>

                          <div className="border-t border-gray-100 pt-3 space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Gotovina za uplatu:</span>
                              <span className="font-semibold text-gray-800">
                                {calc.gotovinaZaUplatu.toLocaleString('sr-RS')} RSD
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">Ukupno gotovina:</span>
                              <span className="font-bold text-blue-600">
                                {calc.ukupnoGotovina.toLocaleString('sr-RS')} RSD
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
