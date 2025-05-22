import { useState, useEffect } from 'react';
import { getCalculations, getAllDates, getCalculationsByDate, deleteCalculation } from '../utils/storage';
import Link from 'next/link';

export default function Istorija() {
  const [calculations, setCalculations] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [allDates, setAllDates] = useState([]);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const dates = getAllDates();
    const allCalcs = getCalculations();
    setAllDates(dates);
    setCalculations(allCalcs);
    
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  };

  const handleDateChange = (datum) => {
    setSelectedDate(datum);
    if (datum === '') {
      setCalculations(getCalculations());
      setShowAll(true);
    } else {
      setCalculations(getCalculationsByDate(datum));
      setShowAll(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Da li ste sigurni da želite da obrišete ovu kalkulaciju?')) {
      deleteCalculation(id);
      loadData();
      // Refresh trenutni prikaz
      if (showAll) {
        setCalculations(getCalculations());
      } else {
        setCalculations(getCalculationsByDate(selectedDate));
      }
    }
  };

  const formatDate = (datum) => {
    const date = new Date(datum);
    return date.toLocaleDateString('sr-RS', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTotalForDate = (datum) => {
    const calcsForDate = getCalculationsByDate(datum);
    return calcsForDate.reduce((sum, calc) => sum + (calc.ukupnoGotovina || 0), 0);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Istorija kalkulacija</h1>
        <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Nova kalkulacija
        </Link>
      </div>

      {allDates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Nemate sačuvane kalkulacije</p>
          <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg">
            Kreiraj prvu kalkulaciju
          </Link>
        </div>
      ) : (
        <>
          {/* Filter po datumu */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">Filtriraj po datumu:</label>
            <select 
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg"
            >
              <option value="">Svi datumi</option>
              {allDates.map(datum => (
                <option key={datum} value={datum}>
                  {formatDate(datum)} - Ukupno: {getTotalForDate(datum)} RSD
                </option>
              ))}
            </select>
          </div>

          {/* Prikaz kalkulacija */}
          <div className="space-y-4">
            {calculations.length === 0 ? (
              <p className="text-gray-500 text-center">Nema kalkulacija za izabrani datum</p>
            ) : (
              calculations.map((calc) => (
                <div key={calc.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{formatDate(calc.datum)}</h3>
                      <p className="text-sm text-gray-500">
                        Sačuvano: {new Date(calc.timestamp).toLocaleString('sr-RS')}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(calc.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ Obriši
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p><strong>Gotovina po programu:</strong> {calc.gotovinaPoProgramu}</p>
                      <p><strong>Kartica po programu:</strong> {calc.karticaPoProgramu}</p>
                      <p><strong>Kartica po izvodu:</strong> {calc.karticaPoIzvodu}</p>
                    </div>
                    <div>
                      <p><strong>Popust po programu:</strong> {calc.popustPoProgramu}</p>
                      <p><strong>Popust VIP:</strong> {calc.popustVIP}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Gotovina za uplatu:</span>
                      <span className="font-bold text-green-600">{calc.gotovinaZaUplatu} RSD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Ukupna gotovina:</span>
                      <span className="font-bold text-blue-600 text-lg">{calc.ukupnoGotovina} RSD</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sumarni prikaz */}
          {!showAll && selectedDate && (
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Rezime za {formatDate(selectedDate)}:</h3>
              <p className="text-xl font-bold text-green-600">
                Ukupan iznos: {getTotalForDate(selectedDate)} RSD
              </p>
              <p className="text-sm text-gray-600">
                Broj kalkulacija: {getCalculationsByDate(selectedDate).length}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}