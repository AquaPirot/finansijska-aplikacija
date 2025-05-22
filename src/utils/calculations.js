// Funkcija za izračunavanje gotovine za uplatu
export const calculateGotovinaZaUplatu = ({ gotovinaPoProgramu, karticaPoProgramu, karticaPoIzvodu }) => {
  return gotovinaPoProgramu + karticaPoProgramu - karticaPoIzvodu;
};

// Funkcija za izračunavanje ukupne gotovine
export const calculateUkupnoGotovina = ({ gotovinaZaUplatu, popustPoProgramu, popustVIP }) => {
  return gotovinaZaUplatu + (popustPoProgramu - popustVIP);
};