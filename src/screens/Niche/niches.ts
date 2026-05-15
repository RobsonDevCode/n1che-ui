// TODO: replace with GET /niches from the API
export const NICHES = [
  { id: 'goth',        label: 'Goth',       sub: 'dark',         desc: 'Dark aesthetics, velvet, silver hardware', count: 847  },
  { id: 'oldmoney',    label: 'Old Money',  sub: 'quiet luxury', desc: 'Tailored cuts, cashmere, quiet luxury',    count: 1203 },
  { id: 'skater',      label: 'Skater',     sub: 'streetwise',   desc: 'Baggy fits, graphic tees, low-tops',       count: 2104 },
  { id: 'streetwear',  label: 'Streetwear', sub: 'culture',      desc: 'Limited drops, hoodies, sneaker culture',  count: 3281 },
  { id: 'cottagecore', label: 'Cottage',    sub: 'soft',         desc: 'Floral prints, linen, handmade pieces',    count: 612  },
  { id: 'y2k',         label: 'Y2K',        sub: 'retro-future', desc: 'Low rise, chrome, butterfly clips',        count: 988  },
  { id: 'techwear',    label: 'Techwear',   sub: 'utility',      desc: 'Utility, waterproof, tactical fits',       count: 741  },
  { id: 'vintage',     label: 'Vintage',    sub: 'archive',      desc: 'Deadstock, 80s/90s, thrift finds',         count: 1567 },
] as const;

export type NicheId = typeof NICHES[number]['id'];
