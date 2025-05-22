// Funkcije za čuvanje i učitavanje podataka
export const saveCalculation = (calculationData) => {
  const existingData = getCalculations();
  const newData = {
    id: Date.now(),
    datum: calculationData.datum,
    gotovinaPoProgramu: calculationData.gotovinaPoProgramu,
    karticaPoProgramu: calculationData.karticaPoProgramu,
    karticaPoIzvodu: calculationData.karticaPoIzvodu,
    gotovinaZaUplatu: calculationData.gotovinaZaUplatu,
    popustPoProgramu: calculationData.popustPoProgramu || 0,
    popustVIP: calculationData.popustVIP || 0,
    ukupnoGotovina: calculationData.ukupnoGotovina,
    timestamp: new Date().toISOString()
  };
  
  const updatedData = [newData, ...existingData];
  localStorage.setItem('finansijske-kalkulacije', JSON.stringify(updatedData));
};

export const getCalculations = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('finansijske-kalkulacije');
  return data ? JSON.parse(data) : [];
};

export const getCalculationsByDate = (datum) => {
  const calculations = getCalculations();
  return calculations.filter(calc => calc.datum === datum);
};

export const getAllDates = () => {
  const calculations = getCalculations();
  const dates = [...new Set(calculations.map(calc => calc.datum))];
  return dates.sort((a, b) => new Date(b) - new Date(a));
};

export const deleteCalculation = (id) => {
  const calculations = getCalculations();
  const filtered = calculations.filter(calc => calc.id !== id);
  localStorage.setItem('finansijske-kalkulacije', JSON.stringify(filtered));
};