import { useState } from 'react';
import { useRouter } from 'next/router';
import { calculateGotovinaZaUplatu } from '../utils/calculations';
import Link from 'next/link';

export default function PrvaStrana() {
  const router = useRouter();
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]);
  const [gotovinaPoProgramu, setGotovinaPoProgramu] = useState('');
  const [karticaPoProgramu, setKarticaPoProgramu] = useState('');
  const [karticaPoIzvodu, setKarticaPoIzvodu] = useState('');
  const [gotovinaZaUplatu, setGotovinaZaUplatu] = useState(null);

  const handleIzracunaj = () => {
    const rezultat = calculateGotovinaZaUplatu({
      gotovinaPoProgramu: Number(gotovinaPoProgramu) || 0,
      karticaPoProgramu: Number(karticaPoProgramu) || 0,
      karticaPoIzvodu: Number(karticaPoIzvodu) || 0
    });
    
    setGotovinaZaUplatu(rezultat);
  };

  const handleNext = () => {
    if (gotovinaZaUplatu !== null) {
      router.push({
        pathname: '/ukupno',
        query: { 
          gotovinaZaUplatu,
          datum,
          gotovinaPoProgramu,
          karticaPoProgramu,
          karticaPoIzvodu
        }
      });
    } else {
      alert('Prvo izračunajte gotovinu za uplatu!');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gotovina za uplatu</h1>
        <Link href="/istorija" className="text-blue-500 text-sm">
          Istorija
        </Link>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Datum:</label>
        <input 
          type="date" 
          value={datum} 
          onChange={(e) => setDatum(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Gotovina po programu:</label>
        <input 
          type="number" 
          value={gotovinaPoProgramu} 
          onChange={(e) => setGotovinaPoProgramu(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="0"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Kartica po programu:</label>
        <input 
          type="number" 
          value={karticaPoProgramu} 
          onChange={(e) => setKarticaPoProgramu(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="0"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Kartica po izvodu:</label>
        <input 
          type="number" 
          value={karticaPoIzvodu} 
          onChange={(e) => setKarticaPoIzvodu(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="0"
        />
      </div>
      
      <button 
        onClick={handleIzracunaj}
        className="w-full bg-blue-500 text-white p-3 rounded-lg text-lg font-medium mb-4"
      >
        Izračunaj
      </button>
      
      {gotovinaZaUplatu !== null && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Rezultat:</h2>
          <p className="text-2xl font-bold text-green-600 mb-4">
            Gotovina za uplatu: {gotovinaZaUplatu} RSD
          </p>
          
          <button 
            onClick={handleNext}
            className="w-full bg-green-500 text-white p-3 rounded-lg text-lg font-medium"
          >
            Nastavi na sledeću stranu →
          </button>
        </div>
      )}
    </div>
  );
}