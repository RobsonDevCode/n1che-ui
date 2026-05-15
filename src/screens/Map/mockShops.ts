// TODO: replace with GET /shops/nearby?lat=&lng=&niche= from the API
export interface MockShop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  voteCount: number;
  distanceMi: string;
  isOpen: boolean;
  closingTime: string;
  addedBy: string;
  palIdx: number;
  rotation: number;
  photoUrl?: string;
}

const GOTH_SHOPS: MockShop[] = [
  { id: '1', name: 'Void & Velvet',  address: '87 Brick Lane',      latitude: 51.5221, longitude: -0.0714, voteCount: 247, distanceMi: '0.2mi', isOpen: true,  closingTime: 'Closes 7pm',   addedBy: 'darkrose_',  palIdx: 0, rotation: -7 },
  { id: '2', name: 'Séance Supply',  address: '12 Hanbury St',       latitude: 51.5198, longitude: -0.0729, voteCount: 189, distanceMi: '0.4mi', isOpen: true,  closingTime: 'Closes 6pm',   addedBy: 'morticia.x', palIdx: 1, rotation:  5 },
  { id: '3', name: 'The Crypt',      address: '45 Commercial St',    latitude: 51.5182, longitude: -0.0752, voteCount: 312, distanceMi: '0.7mi', isOpen: false, closingTime: 'Opens 11am',   addedBy: 'vlad333',    palIdx: 2, rotation: -8 },
  { id: '4', name: 'Ritual Threads', address: '18 Bethnal Green Rd', latitude: 51.5244, longitude: -0.0698, voteCount: 98,  distanceMi: '0.9mi', isOpen: true,  closingTime: 'Closes 8pm',   addedBy: 'hex_hex',    palIdx: 3, rotation:  4 },
];

const OLD_MONEY_SHOPS: MockShop[] = [
  { id: '1', name: 'Harwick & Sons', address: '91 Brick Lane',    latitude: 51.5225, longitude: -0.0710, voteCount: 502, distanceMi: '0.2mi', isOpen: true,  closingTime: 'Closes 6pm',  addedBy: 'clemence_r', palIdx: 0, rotation: -5 },
  { id: '2', name: 'Pemberton',      address: '22 Hanbury St',    latitude: 51.5201, longitude: -0.0733, voteCount: 341, distanceMi: '0.4mi', isOpen: true,  closingTime: 'Closes 5pm',  addedBy: 'oconnell_w', palIdx: 1, rotation:  6 },
  { id: '3', name: 'The Ivory Room', address: '5 Elder St',       latitude: 51.5190, longitude: -0.0748, voteCount: 213, distanceMi: '0.6mi', isOpen: true,  closingTime: 'Closes 7pm',  addedBy: 'flora.b',    palIdx: 2, rotation: -9 },
  { id: '4', name: 'Aldgate Row',    address: '34 Brushfield St', latitude: 51.5177, longitude: -0.0762, voteCount: 178, distanceMi: '0.9mi', isOpen: false, closingTime: 'Opens 10am',  addedBy: 'archie_t',   palIdx: 3, rotation:  4 },
];

const SKATER_SHOPS: MockShop[] = [
  { id: '1', name: 'Concrete & Thread', address: '72 Brick Lane',   latitude: 51.5218, longitude: -0.0718, voteCount: 619, distanceMi: '0.2mi', isOpen: true,  closingTime: 'Closes 8pm',  addedBy: 'ollie_j',    palIdx: 0, rotation:  4 },
  { id: '2', name: 'Gnarly',            address: '9 Hanbury St',     latitude: 51.5196, longitude: -0.0726, voteCount: 487, distanceMi: '0.4mi', isOpen: true,  closingTime: 'Closes 7pm',  addedBy: 'sk8_rat',    palIdx: 1, rotation: -6 },
  { id: '3', name: 'Ramp Room',         address: '37 Sclater St',    latitude: 51.5241, longitude: -0.0702, voteCount: 334, distanceMi: '0.6mi', isOpen: true,  closingTime: 'Closes 9pm',  addedBy: 'kickflip99', palIdx: 2, rotation:  7 },
  { id: '4', name: 'Bail & Board',      address: '55 Commercial St', latitude: 51.5180, longitude: -0.0755, voteCount: 201, distanceMi: '0.9mi', isOpen: false, closingTime: 'Opens 11am',  addedBy: 'phat_wheel', palIdx: 3, rotation: -5 },
];

const STREETWEAR_SHOPS: MockShop[] = [
  { id: '1', name: 'Drip District', address: '104 Brick Lane',      latitude: 51.5228, longitude: -0.0707, voteCount: 891, distanceMi: '0.2mi', isOpen: true,  closingTime: 'Closes 9pm',  addedBy: 'sneakerhead_k', palIdx: 0, rotation: -7 },
  { id: '2', name: 'Hype Chamber',  address: '3 Cheshire St',       latitude: 51.5209, longitude: -0.0723, voteCount: 734, distanceMi: '0.4mi', isOpen: true,  closingTime: 'Closes 8pm',  addedBy: 'lil_fits',      palIdx: 1, rotation:  5 },
  { id: '3', name: 'Box Logo',      address: '28 Sclater St',       latitude: 51.5238, longitude: -0.0705, voteCount: 612, distanceMi: '0.6mi', isOpen: true,  closingTime: 'Closes 7pm',  addedBy: 'wave_check',    palIdx: 2, rotation: -8 },
  { id: '4', name: 'Thermal',       address: '16 Bethnal Green Rd', latitude: 51.5246, longitude: -0.0695, voteCount: 441, distanceMi: '0.9mi', isOpen: false, closingTime: 'Opens 10am',  addedBy: 'crep_protect',  palIdx: 3, rotation:  4 },
];

// Vintage shops clustered around Portobello Road — classic London vintage strip
const VINTAGE_SHOPS: MockShop[] = [
  { id: '1', name: 'The Archive',    address: '112 Portobello Rd',  latitude: 51.5143, longitude: -0.2016, voteCount: 567, distanceMi: '0.1mi', isOpen: true,  closingTime: 'Closes 6pm',  addedBy: 'dusty_racks',  palIdx: 0, rotation: -6 },
  { id: '2', name: 'Found & Bound',  address: '89 Portobello Rd',   latitude: 51.5131, longitude: -0.2010, voteCount: 412, distanceMi: '0.3mi', isOpen: true,  closingTime: 'Closes 5pm',  addedBy: 'thrift_witch', palIdx: 1, rotation:  7 },
  { id: '3', name: 'Second Chapter', address: '14 Pembridge Rd',    latitude: 51.5119, longitude: -0.1993, voteCount: 334, distanceMi: '0.5mi', isOpen: true,  closingTime: 'Closes 7pm',  addedBy: 'rethread_co',  palIdx: 2, rotation: -9 },
  { id: '4', name: 'Old Flame',      address: '3 Westbourne Grove', latitude: 51.5108, longitude: -0.1976, voteCount: 198, distanceMi: '0.7mi', isOpen: false, closingTime: 'Opens 10am',  addedBy: 'retrograde_',  palIdx: 3, rotation:  5 },
];

export const MOCK_SHOPS_BY_NICHE: Record<string, MockShop[]> = {
  goth:        GOTH_SHOPS,
  oldmoney:    OLD_MONEY_SHOPS,
  skater:      SKATER_SHOPS,
  streetwear:  STREETWEAR_SHOPS,
  vintage:     VINTAGE_SHOPS,
  cottagecore: GOTH_SHOPS,
  y2k:         GOTH_SHOPS,
  techwear:    GOTH_SHOPS,
};

export const DEFAULT_REGION = {
  latitude: 51.5213,
  longitude: -0.0728,
  latitudeDelta: 0.012,
  longitudeDelta: 0.008,
};

export const PORTOBELLO_REGION = {
  latitude: 51.5128,
  longitude: -0.2000,
  latitudeDelta: 0.010,
  longitudeDelta: 0.007,
};
