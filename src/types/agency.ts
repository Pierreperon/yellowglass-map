export interface Agency {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  services: string[];
}

export const AGENCIES: Agency[] = [
  {
    id: 1,
    name: "Yellow Glass Rennes",
    address: "3, Rue Jules Corvaisier",
    city: "Combourg",
    postalCode: "35270",
    phone: "02 99 73 12 34",
    lat: 48.4167,
    lng: -1.7500,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 2,
    name: "Yellow Glass Angers",
    address: "ACTIVAPARK, Rue du Pré des Landes",
    city: "Saint-Léger-de-Linières",
    postalCode: "49170",
    phone: "02 41 92 45 67",
    lat: 47.3833,
    lng: -1.0833,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 3,
    name: "Yellow Glass Nice",
    address: "38 Rte de Canta Galet",
    city: "Nice",
    postalCode: "06200",
    phone: "04 93 84 56 78",
    lat: 43.7102,
    lng: 7.2620,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  },
  {
    id: 4,
    name: "Yellow Glass Tourrettes",
    address: "121 CHEMIN DE CAMBARRAS LOT 10",
    city: "Tourrettes",
    postalCode: "83440",
    phone: "04 94 76 89 12",
    lat: 43.5667,
    lng: 6.7500,
    hours: "Lun-Ven: 8h00-18h00, Sam: 8h00-12h00",
    services: ["Remplacement pare-brise", "Réparation impact", "Intervention à domicile"]
  }
];