import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { calculateUkupnoGotovina } from '../utils/calculations';
import { saveCalculation } from '../utils/storage';
import Link from 'next/link';

export default function DrugaStrana() {
  const router = useRouter();
  const { gotovinaZaUplatu, datum, gotovinaPoProgramu, karticaPoProgramu, karticaPoIzvodu } = router.query;
  
  const [popustPoProgramu, setPopustPoProgramu] = useState('');
  const [popustVIP, setPopustVIP] = useState('');
  const [ukupnoGotovina, setUkupnoGotovina] = useState(null);
  const [sacuvano, setSacuvano] = useState(false);
  
  useEffect(() => {
    if (router.isReady && !gotovinaZaUplatu) {
      alert('Morate prvo popuniti prvu stranu!');
      router.push('/');
    }
  }, [gotovinaZaUplatu, router]);

  const handleIzracunaj = () => {
    if (!gotovinaZaUplatu) return;
    
    const rezultat = calculateUkupnoGotovina({
      gotovinaZaUplatu: Number(gotovinaZaUplatu),
      popustPoProgramu: Number(popustPoProgramu) || 0,
      popustVIP: Number(popustVIP) || 0
    });
    
    setUkupnoGotovina(rezultat);
    setSacuvano(false);
  };

  const handleSacuvaj = () => {
    if (ukupnoGotovina === null) {
      alert('Prvo izračunajte ukupnu gotovinu!');
      return;
    }

    const calculationData = {
      datum,
      gotovinaPoProgramu: Number(gotovinaPoProgramu),
      karticaPoProgramu: Number(karticaPoProgramu),
      karticaPoIzvodu: Number(karticaPoIzvodu),
      gotovinaZaUplatu: Number(gotovinaZaUplatu),
      popustPoProgramu: Number(popustPoProgramu) || 0,
      popustVIP: Number(popustVIP) || 0,
      ukupnoGotovina: ukupnoGotovina
    };

    saveCalculation(calculationData);
    setSacuvano(true);
    alert('Kalkulacija je sačuvana!');
  };

  const handleNoveKalkulacije = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Ukupna gotovina</h1>
        <Link href="/istorija" className="text-blue-500 text-sm">
          Istorija
        </Link>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="font-medium mb-2">Podaci iz prvog koraka:</h3>
        <p className="text-sm">Datum: {datum}</p>
        <p className="text-lg font-bold text-green-600">
          Gotovina za uplatu: {gotovinaZaUplatu} RSD
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Popust po programu:</label>
        <input 
          type="number" 
          value={popustPoProgramu} 
          onChange={(e) => setPopustPoProgramu(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="0"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium">Popust VIP:</label>
        <input 
          type="number" 
          value={popustVIP} 
          onChange={(e) => setPopustVIP(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="0"
        />
      </div>
      
      <button 
        onClick={handleIzracunaj}
        className="w-full bg-blue-500 text-white p-3 rounded-lg text-lg font-medium mb-4"
      >
        Izračunaj ukupno
      </button>
      
      {ukupnoGotovina !== null && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Finalni rezultat:</h2>
          <p className="text-3xl font-bold text-green-600 mb-4">
            {ukupnoGotovina} RSD
          </p>
          
          <button 
            onClick={handleSacuvaj}
            className={`w-full p-3 rounded-lg text-lg font-medium mb-2 ${
              sacuvano 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            disabled={sacuvano}
          >
            {sacuvano ? '✅ Sačuvano' : '💾 Sačuvaj kalkulaciju'}
          </button>
        </div>
      )}
      
      <div className="flex gap-2">
        <button 
          onClick={handleNoveKalkulacije}
          className="flex-1 bg-blue-500 text-white p-3 rounded-lg font-medium"
        >
          Nova kalkulacija
        </button>
        <Link href="/istorija" className="flex-1">
          <button className="w-full bg-gray-500 text-white p-3 rounded-lg font-medium">
            Pogledaj istoriju
          </button>
        </Link>
      </div>
    </div>
  );
}