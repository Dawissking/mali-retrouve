export interface Category {
  id: string;
  code: string;
  labelFr: string;
  nature: "DOCUMENT" | "OBJET";
  domains: Domain[];
}

export interface Domain {
  id: string;
  code: string;
  labelFr: string;
  categoryId: string;
  types: ItemType[];
}

export interface ItemType {
  id: string;
  code: string;
  labelFr: string;
  domainId: string;
}

export interface Village {
  id: string;
  code: string;
  labelFr: string;
  communeId: string;
  latitude?: number;
  longitude?: number;
}

export interface Commune {
  id: string;
  code: string;
  labelFr: string;
  cercleId: string;
  villages: Village[];
}

export interface Cercle {
  id: string;
  code: string;
  labelFr: string;
  regionId: string;
  communes: Commune[];
}

export interface Region {
  id: string;
  code: string;
  labelFr: string;
  population?: number;
  cercles: Cercle[];
}

export type Zone = Region;
