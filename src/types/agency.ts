export interface Agency {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  lat: number;
  lng: number;
  type: string;
}

export const AGENCIES: Agency[] = [
  {
    id: 1,
    name: "MONTLUÇON",
    address: "3 Rue Albert Einstein",
    city: "Montluçon",
    postalCode: "03100",
    phone: "04 70 05 11 xx",
    lat: 46.3404,
    lng: 2.6038,
    type: "Agence"
  },
  {
    id: 2,
    name: "BOURGES",
    address: "Zone Industriel Farjallat",
    city: "Bourges",
    postalCode: "18000",
    phone: "02 48 20 37 xx",
    lat: 47.0810,
    lng: 2.3988,
    type: "Agence"
  },
  {
    id: 3,
    name: "CHÂTEAUROUX",
    address: "Allée de l'Industrie",
    city: "Châteauroux",
    postalCode: "36130",
    phone: "02 54 60 37 xx",
    lat: 46.8109,
    lng: 1.6944,
    type: "Agence"
  },
  {
    id: 4,
    name: "PARIS NORD",
    address: "Avenue Jean Jaurès",
    city: "Saint-Denis",
    postalCode: "93200",
    phone: "01 48 13 45 xx",
    lat: 48.9356,
    lng: 2.3539,
    type: "Agence"
  },
  {
    id: 5,
    name: "LYON CENTRE",
    address: "Rue de la République",
    city: "Lyon",
    postalCode: "69002",
    phone: "04 78 42 15 xx",
    lat: 45.7640,
    lng: 4.8357,
    type: "Agence"
  },
  {
    id: 6,
    name: "MARSEILLE",
    address: "Boulevard Michelet",
    city: "Marseille",
    postalCode: "13008",
    phone: "04 91 73 28 xx",
    lat: 43.2965,
    lng: 5.3698,
    type: "Agence"
  }
];